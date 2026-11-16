/* Pure Community Support — shop catalog in D1 (tables products, tags, product_tags,
   featured_products; see schema.sql).

   publicProducts()  GET /api/products, read by the shop, item and order list pages
   adminApi()        /admin/api/*, used by the admin dashboard (admin/home.html); routes are
                     listed at the top of worker/index.js

   Photos are not handled here: until R2 is connected they are listed in public/assets/js/products.js.
   Prices are stored as whole US cents (price_cents) and sent to pages as dollars (price). */

import { canEdit, canView } from './access.js';
import { API_HEADERS, ApiError, bad, flag, freeId, json, readJson, text } from './api.js';

const PUBLIC_MAX_AGE = 60;     // seconds browsers and Cloudflare may reuse /api/products
const MAX_BATCH = 200;         // most products one batch action can change
const ID_PATTERN = /^[a-z0-9-]{1,80}$/;
const RESERVED_IDS = new Set(['new', 'batch']); // would clash with /admin/products/new and /admin/api/products/batch
const FEATURED_SLOTS = 4;      // products the home page can feature

/* Product ids in the home page's featured slots, in slot order (only existing products; a deleted
   product's slot is emptied by ON DELETE CASCADE). onlyShown leaves out hidden products. Gives no
   slots if the featured_products table hasn't been created yet, so the shop keeps working. */
async function featuredRows(env, onlyShown) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT f.slot, f.product_id FROM featured_products f JOIN products p ON p.id = f.product_id
      ${onlyShown ? 'WHERE p.shown = 1' : ''} ORDER BY f.slot`).all();
    return results;
  } catch (err) {
    if (/no such table/.test(String(err && err.message))) return [];
    throw err;
  }
}

/* Every product's tag ids, in tag order. */
const LINKS_SQL = `
  SELECT pt.product_id, pt.tag_id
  FROM product_tags pt JOIN tags t ON t.id = pt.tag_id
  ORDER BY t.sort_order, t.name`;

function tagsByProduct(links) {
  const map = new Map();
  for (const { product_id, tag_id } of links) {
    if (!map.has(product_id)) map.set(product_id, []);
    map.get(product_id).push(tag_id);
  }
  return map;
}

const priceOf = row => (row.price_cents === null ? null : row.price_cents / 100);

/* Answers can be reused for a minute, whatever query string is added. */
const cacheKey = url => new Request(`${url.origin}/api/products`);

/* ── Public catalog ─────────────────────────── */

export async function publicProducts(request, env, ctx, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return json({ error: 'Method not allowed' }, 405);

  const cache = caches.default;
  const cached = await cache.match(cacheKey(url));
  if (cached) return cached;

  const [products, tags, links] = await env.DB.batch([
    env.DB.prepare(`
      SELECT id, name, description, price_cents, maker, material, colour, is_new
      FROM products WHERE shown = 1 ORDER BY sort_order, name`),
    env.DB.prepare('SELECT id, name FROM tags ORDER BY sort_order, name'),
    env.DB.prepare(LINKS_SQL),
  ]);
  const tagsOf = tagsByProduct(links.results);
  const featured = await featuredRows(env, true);
  const body = {
    featured: featured.map(f => f.product_id),
    products: products.results.map(r => ({
      id: r.id,
      name: r.name,
      desc: r.description || '',
      price: priceOf(r),
      maker: r.maker || '',
      material: r.material || '',
      colour: r.colour || '',
      isNew: r.is_new === 1,
      tags: tagsOf.get(r.id) || [],
    })),
    tags: tags.results.map(t => ({ id: t.id, name: t.name })),
  };

  const response = json(body, 200, { ...API_HEADERS, 'Cache-Control': `public, max-age=${PUBLIC_MAX_AGE}` });
  ctx.waitUntil(cache.put(cacheKey(url), response.clone()));
  return response;
}

/* ── Admin data API ─────────────────────────── */

export async function adminApi(request, env, ctx, url, path, user) {
  try {
    return await adminRoute(request, env, ctx, url, path, user);
  } catch (err) {
    if (err instanceof ApiError) return json({ error: err.message }, err.status);
    const message = String(err && err.message);
    if (/UNIQUE constraint failed: tags\.name/.test(message)) {
      return json({ error: 'There is already a tag with that name.' }, 409);
    }
    if (/no such table/.test(message)) {
      return json({ error: 'The shop tables don’t exist yet: run schema.sql, then seed-catalog.sql, in the D1 Console.' }, 500);
    }
    console.error('admin api error:', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}

async function adminRoute(request, env, ctx, url, path, user) {
  const method = request.method;
  const [kind, rawId, extra] = path.slice('/admin/api/'.length).split('/');
  if (extra !== undefined) throw new ApiError(404, 'Not found');
  const id = rawId === undefined ? undefined : decodeId(rawId);

  if (method === 'GET') {
    if (kind !== 'catalog' || id !== undefined) throw new ApiError(404, 'Not found');
    // Products shows tag names and Tags shows product counts, so either page needs the whole catalog.
    if (!canView(user, 'products') && !canView(user, 'tags')) throw new ApiError(403, 'Your account can’t open Products or Tags.');
    return json({ catalog: await adminCatalog(env) });
  }

  // Every change: a same-origin request from someone who can edit that page.
  if (request.headers.get('Origin') !== url.origin) throw new ApiError(403, 'Forbidden');
  if (kind !== 'products' && kind !== 'tags' && kind !== 'featured') throw new ApiError(404, 'Not found');
  const page = kind === 'featured' ? 'products' : kind; // the featured slots are on the Products screen
  if (!canEdit(user, page)) {
    throw new ApiError(403, canView(user, page) ? 'Your account has view-only access to this page.' : 'Your account can’t open this page.');
  }
  const body = method === 'DELETE' ? {} : await readJson(request);

  let answer = {};
  if (kind === 'products' && method === 'POST' && id === undefined) answer = { id: await addProduct(env, body, user) };
  else if (kind === 'products' && method === 'POST' && id === 'batch') await batchProducts(env, body, user);
  else if (kind === 'products' && method === 'PUT' && id) await saveProduct(env, id, body, user);
  else if (kind === 'products' && method === 'PATCH' && id) await setShown(env, id, body, user);
  else if (kind === 'featured' && method === 'PUT' && id === undefined) await saveFeatured(env, body);
  else if (kind === 'tags' && method === 'POST' && id === undefined) answer = { id: await addTag(env, body) };
  else if (kind === 'tags' && method === 'PUT' && id) await renameTag(env, id, body);
  else if (kind === 'tags' && method === 'DELETE' && id) await deleteTag(env, id);
  else throw new ApiError(404, 'Not found');

  // The shop sees the change within a minute; this clears this data centre's copy straight away.
  ctx.waitUntil(caches.default.delete(cacheKey(url)));
  return json({ ...answer, catalog: await adminCatalog(env) });
}

function decodeId(raw) {
  let id;
  try { id = decodeURIComponent(raw); } catch { throw new ApiError(404, 'Not found'); }
  if (!ID_PATTERN.test(id)) throw new ApiError(404, 'Not found');
  return id;
}

/* Everything the admin shows: every product (Shown and Hidden) with its Vietnamese fields, every tag,
   and the home page's featured slots (featured: product id or null for each slot, in order). */
async function adminCatalog(env) {
  const [products, tags, links] = await env.DB.batch([
    env.DB.prepare('SELECT * FROM products ORDER BY sort_order, name'),
    env.DB.prepare('SELECT id, name, name_vi FROM tags ORDER BY sort_order, name'),
    env.DB.prepare(LINKS_SQL),
  ]);
  const tagsOf = tagsByProduct(links.results);
  const featured = Array(FEATURED_SLOTS).fill(null);
  for (const f of await featuredRows(env, false)) if (f.slot >= 1 && f.slot <= FEATURED_SLOTS) featured[f.slot - 1] = f.product_id;
  return {
    featured,
    products: products.results.map(r => ({
      id: r.id,
      name: r.name,
      nameVi: r.name_vi || '',
      desc: r.description || '',
      descVi: r.description_vi || '',
      price: priceOf(r),
      maker: r.maker || '',
      material: r.material || '',
      materialVi: r.material_vi || '',
      colour: r.colour || '',
      colourVi: r.colour_vi || '',
      shown: r.shown === 1,
      isNew: r.is_new === 1,
      sort: r.sort_order,
      tags: tagsOf.get(r.id) || [],
    })),
    tags: tags.results.map(t => ({ id: t.id, name: t.name, nameVi: t.name_vi || '' })),
  };
}

/* ── Checking what the admin sends (text, flag: worker/api.js) ── */

/* Dollars (number) to whole cents; null or empty means "Price TBD". */
function cents(value, { required = false } = {}) {
  if (value === null || value === undefined || value === '') {
    if (required) throw bad('Enter a price in US dollars, like 48 or 48.50.');
    return null;
  }
  const n = Number(value);
  const c = Math.round(n * 100);
  if (!Number.isFinite(n) || n < 0 || n > 100000 || Math.abs(c - n * 100) > 1e-6) {
    throw bad('Enter a price in US dollars, like 48 or 48.50.');
  }
  return c;
}

function idList(value, label) {
  if (!Array.isArray(value)) throw bad(`Choose ${label}.`);
  const ids = [...new Set(value)];
  if (ids.length > MAX_BATCH) throw bad(`Choose up to ${MAX_BATCH} at a time.`);
  if (!ids.every(id => typeof id === 'string' && ID_PATTERN.test(id))) throw bad('That request could not be read.');
  return ids;
}

function cleanProduct(body) {
  return {
    name: text(body, 'name', 'A name', 200, { required: true, single: true }),
    nameVi: text(body, 'nameVi', 'The Vietnamese name', 200, { single: true }),
    desc: text(body, 'desc', 'The description', 5000),
    descVi: text(body, 'descVi', 'The Vietnamese description', 5000),
    price: cents(body.price),
    maker: text(body, 'maker', 'Made by', 200, { single: true }),
    material: text(body, 'material', 'The material', 200, { single: true }),
    materialVi: text(body, 'materialVi', 'The Vietnamese material', 200, { single: true }),
    colour: text(body, 'colour', 'The colour', 200, { single: true }),
    colourVi: text(body, 'colourVi', 'The Vietnamese colour', 200, { single: true }),
    shown: flag(body, 'shown', true),
    isNew: flag(body, 'isNew', false),
    tags: body.tags === undefined ? [] : idList(body.tags, 'tags'),
  };
}

/* ── Products ───────────────────────────────── */

const PRODUCT_COLUMNS = 'id, name, name_vi, description, description_vi, price_cents, maker, material, material_vi, colour, colour_vi, shown, is_new, updated_by, sort_order';
const productValues = (id, p, user) => [
  id, p.name, p.nameVi, p.desc, p.descVi, p.price, p.maker, p.material, p.materialVi,
  p.colour, p.colourVi, p.shown ? 1 : 0, p.isNew ? 1 : 0, user.id,
];
const NEXT_SORT = '(SELECT COALESCE(MAX(sort_order), -1) + 1 FROM products)';

/* Replace a product's tags; tag ids that don't exist are skipped. */
function tagStatements(env, id, tags) {
  return [
    env.DB.prepare('DELETE FROM product_tags WHERE product_id = ?').bind(id),
    env.DB.prepare(`
      INSERT INTO product_tags (product_id, tag_id)
      SELECT ?1, id FROM tags WHERE id IN (SELECT value FROM json_each(?2))`).bind(id, JSON.stringify(tags)),
  ];
}

async function addProduct(env, body, user) {
  const p = cleanProduct(body);
  const id = await freeId(env, 'products', p.name, RESERVED_IDS);
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO products (${PRODUCT_COLUMNS}) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ${NEXT_SORT})`)
      .bind(...productValues(id, p, user)),
    ...tagStatements(env, id, p.tags),
  ]);
  return id;
}

async function saveProduct(env, id, body, user) {
  const p = cleanProduct(body);
  const exists = await env.DB.prepare('SELECT 1 FROM products WHERE id = ?').bind(id).first();
  if (!exists) throw new ApiError(404, 'That product no longer exists. Someone may have deleted it.');
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE products SET name = ?2, name_vi = ?3, description = ?4, description_vi = ?5, price_cents = ?6,
        maker = ?7, material = ?8, material_vi = ?9, colour = ?10, colour_vi = ?11, shown = ?12, is_new = ?13,
        updated_by = ?14, updated_at = datetime('now')
      WHERE id = ?1`).bind(...productValues(id, p, user)),
    ...tagStatements(env, id, p.tags),
  ]);
}

async function setShown(env, id, body, user) {
  if (typeof body.shown !== 'boolean') throw bad('That request could not be read.');
  const result = await env.DB.prepare(`UPDATE products SET shown = ?2, updated_by = ?3, updated_at = datetime('now') WHERE id = ?1`)
    .bind(id, body.shown ? 1 : 0, user.id).run();
  if (!result.meta.changes) throw new ApiError(404, 'That product no longer exists. Someone may have deleted it.');
}

async function batchProducts(env, body, user) {
  if (body.action === 'delete') {
    const ids = JSON.stringify(idList(body.ids, 'products'));
    await env.DB.batch([
      env.DB.prepare('DELETE FROM product_tags WHERE product_id IN (SELECT value FROM json_each(?))').bind(ids),
      env.DB.prepare('DELETE FROM products WHERE id IN (SELECT value FROM json_each(?))').bind(ids),
    ]);
    return;
  }
  if (body.action === 'price') {
    const ids = JSON.stringify(idList(body.ids, 'products'));
    await env.DB.prepare(`
      UPDATE products SET price_cents = ?1, updated_by = ?2, updated_at = datetime('now')
      WHERE id IN (SELECT value FROM json_each(?3))`).bind(cents(body.price, { required: true }), user.id, ids).run();
    return;
  }
  if (body.action === 'restore') {
    // Undo: puts products back exactly as the admin had them (re-adding deleted ones in their old place).
    if (!Array.isArray(body.products) || body.products.length > MAX_BATCH) throw bad('That request could not be read.');
    const statements = body.products.flatMap(raw => {
      if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string' || !ID_PATTERN.test(raw.id)) throw bad('That request could not be read.');
      const p = cleanProduct(raw);
      const sort = Number.isInteger(raw.sort) ? raw.sort : null;
      return [
        env.DB.prepare(`
          INSERT INTO products (${PRODUCT_COLUMNS}) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, COALESCE(?15, ${NEXT_SORT}))
          ON CONFLICT(id) DO UPDATE SET name = excluded.name, name_vi = excluded.name_vi, description = excluded.description,
            description_vi = excluded.description_vi, price_cents = excluded.price_cents, maker = excluded.maker,
            material = excluded.material, material_vi = excluded.material_vi, colour = excluded.colour,
            colour_vi = excluded.colour_vi, shown = excluded.shown, is_new = excluded.is_new,
            updated_by = excluded.updated_by, updated_at = datetime('now')`).bind(...productValues(raw.id, p, user), sort),
        ...tagStatements(env, raw.id, p.tags),
      ];
    });
    if (statements.length) await env.DB.batch(statements);
    return;
  }
  throw bad('That request could not be read.');
}

/* ── Featured on the home page ──────────────── */

/* { ids: [product id or null, ...] }, one entry per slot (up to FEATURED_SLOTS); replaces every slot.
   Ids of products that no longer exist are skipped, leaving that slot empty. */
async function saveFeatured(env, body) {
  const ids = body.ids;
  if (!Array.isArray(ids) || ids.length > FEATURED_SLOTS
    || !ids.every(id => id === null || (typeof id === 'string' && ID_PATTERN.test(id)))) {
    throw bad('That request could not be read.');
  }
  const chosen = ids.filter(Boolean);
  if (new Set(chosen).size !== chosen.length) throw bad('Each product can only be in one slot.');
  await env.DB.batch([
    env.DB.prepare('DELETE FROM featured_products'),
    ...ids.flatMap((id, i) => id === null ? [] : [
      env.DB.prepare('INSERT INTO featured_products (slot, product_id) SELECT ?1, id FROM products WHERE id = ?2').bind(i + 1, id),
    ]),
  ]);
}

/* ── Tags ───────────────────────────────────── */

function cleanTag(body) {
  return {
    name: text(body, 'name', 'A tag name', 60, { required: true, single: true }),
    nameVi: text(body, 'nameVi', 'The Vietnamese tag name', 60, { single: true }),
  };
}

async function addTag(env, body) {
  const t = cleanTag(body);
  const id = await freeId(env, 'tags', t.name, RESERVED_IDS);
  await env.DB.prepare(`
    INSERT INTO tags (id, name, name_vi, sort_order)
    VALUES (?1, ?2, ?3, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tags))`).bind(id, t.name, t.nameVi).run();
  return id;
}

async function renameTag(env, id, body) {
  const t = cleanTag(body);
  const result = await env.DB.prepare('UPDATE tags SET name = ?2, name_vi = ?3 WHERE id = ?1').bind(id, t.name, t.nameVi).run();
  if (!result.meta.changes) throw new ApiError(404, 'That tag no longer exists. Someone may have deleted it.');
}

async function deleteTag(env, id) {
  const [, removed] = await env.DB.batch([
    env.DB.prepare('DELETE FROM product_tags WHERE tag_id = ?').bind(id),
    env.DB.prepare('DELETE FROM tags WHERE id = ?').bind(id),
  ]);
  if (!removed.meta.changes) throw new ApiError(404, 'That tag no longer exists. Someone may have deleted it.');
}
