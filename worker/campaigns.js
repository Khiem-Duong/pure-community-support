/* Pure Community Support — campaigns and their cases in D1 (tables campaigns, cases; see schema.sql).

   publicCampaigns()  GET /api/campaigns, read by /cases and /cases/<id> (assets/js/campaigns.js)
   campaignsApi()     /admin/api/campaigns..., used by the admin's Campaigns & cases screens;
                      routes are listed at the top of worker/index.js

   Photos are not handled here: until R2 is connected they are listed in public/assets/js/campaigns.js.
   "about" is stored as paragraphs separated by a blank line and "covers" as one item per line;
   the public API sends both as lists. */

import { canEdit, canView } from './access.js';
import { API_HEADERS, ApiError, bad, flag, freeId, json, oneLine, readJson, text } from './api.js';

const PUBLIC_MAX_AGE = 60;     // seconds browsers and Cloudflare may reuse /api/campaigns
const ID_PATTERN = /^[a-z0-9-]{1,80}$/;
const CASE_ID_PATTERN = /^\d{1,10}$/;
const RESERVED_IDS = new Set(['new']); // would clash with /admin/campaigns/new
const STATUSES = ['running', 'planned'];

/* Answers can be reused for a minute, whatever query string is added. */
const cacheKey = url => new Request(`${url.origin}/api/campaigns`);

const paragraphs = value => (value || '').split(/\n\s*\n/).map(oneLine).filter(Boolean);
const lines = value => (value || '').split('\n').map(oneLine).filter(Boolean);

function groupBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row[key])) map.set(row[key], []);
    map.get(row[key]).push(row);
  }
  return map;
}

/* ── Public campaigns ───────────────────────── */

export async function publicCampaigns(request, env, ctx, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return json({ error: 'Method not allowed' }, 405);

  const cache = caches.default;
  const cached = await cache.match(cacheKey(url));
  if (cached) return cached;

  const [campaigns, cases] = await env.DB.batch([
    env.DB.prepare(`
      SELECT id, title, title_vi, status, focus, location, format, summary, about, covers
      FROM campaigns WHERE shown = 1 ORDER BY sort_order, title`),
    env.DB.prepare('SELECT campaign_id, name, story, support FROM cases WHERE shown = 1 ORDER BY sort_order, id'),
  ]);
  const casesOf = groupBy(cases.results, 'campaign_id');
  const body = {
    campaigns: campaigns.results.map(r => ({
      id: r.id,
      title: r.title,
      titleVi: r.title_vi || '',
      status: r.status,
      focus: r.focus || '',
      location: r.location || '',
      format: r.format || '',
      summary: r.summary || '',
      about: paragraphs(r.about),
      covers: lines(r.covers),
      cases: (casesOf.get(r.id) || []).map(k => ({ name: k.name, story: k.story || '', support: k.support || '' })),
    })),
  };

  const response = json(body, 200, { ...API_HEADERS, 'Cache-Control': `public, max-age=${PUBLIC_MAX_AGE}` });
  ctx.waitUntil(cache.put(cacheKey(url), response.clone()));
  return response;
}

/* ── Admin data API ─────────────────────────── */

export async function campaignsApi(request, env, ctx, url, path, user) {
  try {
    return await adminRoute(request, env, ctx, url, path, user);
  } catch (err) {
    if (err instanceof ApiError) return json({ error: err.message }, err.status);
    if (/no such table/.test(String(err && err.message))) {
      return json({ error: 'The campaign tables don’t exist yet: run schema.sql, then seed-campaigns.sql, in the D1 Console.' }, 500);
    }
    console.error('campaigns api error:', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}

async function adminRoute(request, env, ctx, url, path, user) {
  const method = request.method;
  // '' | /<id> | /<id>/cases | /<id>/cases/<case id>
  const [, rawId, sub, rawCase, extra] = path.slice('/admin/api/campaigns'.length).split('/');
  if (extra !== undefined || (sub !== undefined && sub !== 'cases')) throw new ApiError(404, 'Not found');
  const id = rawId === undefined ? undefined : decodeId(rawId);
  if (rawCase !== undefined && !CASE_ID_PATTERN.test(rawCase)) throw new ApiError(404, 'Not found');
  const caseId = rawCase === undefined ? undefined : Number(rawCase);

  if (method === 'GET') {
    if (id !== undefined) throw new ApiError(404, 'Not found');
    if (!canView(user, 'campaigns')) throw new ApiError(403, 'Your account can’t open Campaigns & cases.');
    return json({ campaigns: await adminCampaigns(env) });
  }

  // Every change: a same-origin request from someone who can edit Campaigns & cases.
  if (request.headers.get('Origin') !== url.origin) throw new ApiError(403, 'Forbidden');
  if (!canEdit(user, 'campaigns')) {
    throw new ApiError(403, canView(user, 'campaigns') ? 'Your account has view-only access to this page.' : 'Your account can’t open this page.');
  }
  const body = method === 'DELETE' ? {} : await readJson(request);

  let answer = {};
  if (id === undefined && method === 'POST') answer = { id: await addCampaign(env, body, user) };
  else if (id && sub === undefined && method === 'PUT') await saveCampaign(env, id, body, user);
  else if (id && sub === undefined && method === 'PATCH') await setCampaignShown(env, id, body, user);
  else if (id && sub === undefined && method === 'DELETE') await deleteCampaign(env, id);
  else if (id && sub && caseId === undefined && method === 'POST') answer = { caseId: await addCase(env, id, body, user) };
  else if (id && caseId !== undefined && method === 'PUT') await saveCase(env, id, caseId, body, user);
  else if (id && caseId !== undefined && method === 'DELETE') await deleteCase(env, id, caseId);
  else throw new ApiError(404, 'Not found');

  // The website sees the change within a minute; this clears this data centre's copy straight away.
  ctx.waitUntil(caches.default.delete(cacheKey(url)));
  return json({ ...answer, campaigns: await adminCampaigns(env) });
}

function decodeId(raw) {
  let id;
  try { id = decodeURIComponent(raw); } catch { throw new ApiError(404, 'Not found'); }
  if (!ID_PATTERN.test(id)) throw new ApiError(404, 'Not found');
  return id;
}

/* Everything the admin shows: every campaign and case (Shown and Hidden), with the text as stored. */
async function adminCampaigns(env) {
  const [campaigns, cases] = await env.DB.batch([
    env.DB.prepare('SELECT * FROM campaigns ORDER BY sort_order, title'),
    env.DB.prepare('SELECT * FROM cases ORDER BY sort_order, id'),
  ]);
  const casesOf = groupBy(cases.results, 'campaign_id');
  return campaigns.results.map(r => ({
    id: r.id,
    title: r.title,
    titleVi: r.title_vi || '',
    status: r.status,
    focus: r.focus || '',
    location: r.location || '',
    format: r.format || '',
    summary: r.summary || '',
    summaryVi: r.summary_vi || '',
    about: r.about || '',
    aboutVi: r.about_vi || '',
    covers: r.covers || '',
    coversVi: r.covers_vi || '',
    shown: r.shown === 1,
    cases: (casesOf.get(r.id) || []).map(k => ({
      id: k.id,
      name: k.name,
      nameVi: k.name_vi || '',
      story: k.story || '',
      storyVi: k.story_vi || '',
      support: k.support || '',
      shown: k.shown === 1,
    })),
  }));
}

/* ── Campaigns ──────────────────────────────── */

function cleanCampaign(body) {
  if (!STATUSES.includes(body.status)) throw bad('Choose whether the campaign is running or planned.');
  return {
    title: text(body, 'title', 'A title', 200, { required: true, single: true }),
    titleVi: text(body, 'titleVi', 'The Vietnamese title', 200, { single: true }),
    status: body.status,
    focus: text(body, 'focus', 'The focus', 200, { single: true }),
    location: text(body, 'location', 'The location', 200, { single: true }),
    format: text(body, 'format', 'The format', 200, { single: true }),
    summary: text(body, 'summary', 'A summary', 600, { required: true, single: true }),
    summaryVi: text(body, 'summaryVi', 'The Vietnamese summary', 600, { single: true }),
    about: text(body, 'about', 'About the programme', 5000),
    aboutVi: text(body, 'aboutVi', 'The Vietnamese “About the programme”', 5000),
    covers: text(body, 'covers', 'What the programme covers', 2000),
    coversVi: text(body, 'coversVi', 'The Vietnamese “What the programme covers”', 2000),
    shown: flag(body, 'shown', true),
  };
}
const campaignValues = (id, c, user) => [
  id, c.title, c.titleVi, c.status, c.focus, c.location, c.format, c.summary, c.summaryVi,
  c.about, c.aboutVi, c.covers, c.coversVi, c.shown ? 1 : 0, user.id,
];

async function addCampaign(env, body, user) {
  const c = cleanCampaign(body);
  const id = await freeId(env, 'campaigns', c.title, RESERVED_IDS);
  await env.DB.prepare(`
    INSERT INTO campaigns (id, title, title_vi, status, focus, location, format, summary, summary_vi,
      about, about_vi, covers, covers_vi, shown, updated_by, sort_order)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15,
      (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM campaigns))`).bind(...campaignValues(id, c, user)).run();
  return id;
}

async function saveCampaign(env, id, body, user) {
  const c = cleanCampaign(body);
  const result = await env.DB.prepare(`
    UPDATE campaigns SET title = ?2, title_vi = ?3, status = ?4, focus = ?5, location = ?6, format = ?7,
      summary = ?8, summary_vi = ?9, about = ?10, about_vi = ?11, covers = ?12, covers_vi = ?13, shown = ?14,
      updated_by = ?15, updated_at = datetime('now')
    WHERE id = ?1`).bind(...campaignValues(id, c, user)).run();
  if (!result.meta.changes) throw new ApiError(404, 'That campaign no longer exists. Someone may have deleted it.');
}

async function setCampaignShown(env, id, body, user) {
  if (typeof body.shown !== 'boolean') throw bad('That request could not be read.');
  const result = await env.DB.prepare(`UPDATE campaigns SET shown = ?2, updated_by = ?3, updated_at = datetime('now') WHERE id = ?1`)
    .bind(id, body.shown ? 1 : 0, user.id).run();
  if (!result.meta.changes) throw new ApiError(404, 'That campaign no longer exists. Someone may have deleted it.');
}

async function deleteCampaign(env, id) {
  const [, removed] = await env.DB.batch([
    env.DB.prepare('DELETE FROM cases WHERE campaign_id = ?').bind(id),
    env.DB.prepare('DELETE FROM campaigns WHERE id = ?').bind(id),
  ]);
  if (!removed.meta.changes) throw new ApiError(404, 'That campaign no longer exists. Someone may have deleted it.');
}

/* ── Cases ──────────────────────────────────── */

function cleanCase(body) {
  if (body.consent !== true) throw bad('Confirm that the people involved have given consent to publish this case.');
  return {
    name: text(body, 'name', 'A name', 200, { required: true, single: true }),
    nameVi: text(body, 'nameVi', 'The Vietnamese name', 200, { single: true }),
    story: text(body, 'story', 'The story', 3000, { required: true }),
    storyVi: text(body, 'storyVi', 'The Vietnamese story', 3000),
    support: text(body, 'support', 'The total support received', 60, { single: true }),
    shown: flag(body, 'shown', true),
  };
}

async function addCase(env, campaignId, body, user) {
  const k = cleanCase(body);
  const exists = await env.DB.prepare('SELECT 1 FROM campaigns WHERE id = ?').bind(campaignId).first();
  if (!exists) throw new ApiError(404, 'That campaign no longer exists. Someone may have deleted it.');
  const result = await env.DB.prepare(`
    INSERT INTO cases (campaign_id, name, name_vi, story, story_vi, support, shown, consent, consent_by, updated_by, sort_order)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 1, ?8, ?8,
      (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM cases WHERE campaign_id = ?1))`)
    .bind(campaignId, k.name, k.nameVi, k.story, k.storyVi, k.support, k.shown ? 1 : 0, user.id).run();
  return result.meta.last_row_id;
}

async function saveCase(env, campaignId, caseId, body, user) {
  const k = cleanCase(body);
  const result = await env.DB.prepare(`
    UPDATE cases SET name = ?3, name_vi = ?4, story = ?5, story_vi = ?6, support = ?7, shown = ?8,
      updated_by = ?9, updated_at = datetime('now')
    WHERE id = ?1 AND campaign_id = ?2`)
    .bind(caseId, campaignId, k.name, k.nameVi, k.story, k.storyVi, k.support, k.shown ? 1 : 0, user.id).run();
  if (!result.meta.changes) throw new ApiError(404, 'That case no longer exists. Someone may have deleted it.');
}

async function deleteCase(env, campaignId, caseId) {
  const result = await env.DB.prepare('DELETE FROM cases WHERE id = ?1 AND campaign_id = ?2').bind(caseId, campaignId).run();
  if (!result.meta.changes) throw new ApiError(404, 'That case no longer exists. Someone may have deleted it.');
}
