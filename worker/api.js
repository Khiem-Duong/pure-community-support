/* Shared pieces of the admin data API (/admin/api/*), used by catalog.js, campaigns.js and people.js. */

export const API_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
};
const MAX_BODY = 256 * 1024; // largest JSON body accepted from the admin

export const json = (data, status = 200, headers = API_HEADERS) => Response.json(data, { status, headers });

/* An error whose message is safe to show in the admin. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const bad = message => new ApiError(400, message);

export const oneLine = s => s.replace(/\s+/g, ' ').trim();

export async function readJson(request) {
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) throw new ApiError(415, 'Send JSON.');
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY) throw new ApiError(413, 'That request is too large.');
  const text = await request.text();
  if (text.length > MAX_BODY) throw new ApiError(413, 'That request is too large.');
  let data;
  try { data = JSON.parse(text); } catch { throw bad('That request could not be read.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw bad('That request could not be read.');
  return data;
}

/* ── Checking what the admin sends ──────────── */

/* Optional text field: trimmed (single: also one line), empty becomes null. */
export function text(body, key, label, max, { required = false, single = false } = {}) {
  const value = body[key] ?? '';
  if (typeof value !== 'string') throw bad(`${label} must be text.`);
  const clean = single ? oneLine(value) : value.replace(/\r\n?/g, '\n').trim();
  if (required && !clean) throw bad(`Enter ${label.toLowerCase()}.`);
  if (clean.length > max) throw bad(`${label} is too long (up to ${max} characters).`);
  return clean || null;
}

/* Optional true / false field. */
export function flag(body, key, fallback) {
  if (body[key] === undefined) return fallback;
  if (typeof body[key] !== 'boolean') throw bad('That request could not be read.');
  return body[key];
}

/* URL-safe id from a name: "Bình gốm" → "binh-gom". */
export function slugify(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '').slice(0, 60).replace(/-+$/, '') || 'item';
}

/* The slug, or slug-2, slug-3 ... if it is taken in `table` (a fixed table name) or reserved. */
export async function freeId(env, table, name, reserved = new Set()) {
  const base = slugify(name);
  const { results } = await env.DB.prepare(`SELECT id FROM ${table} WHERE id = ?1 OR id LIKE ?1 || '-%'`).bind(base).all();
  const taken = new Set(results.map(r => r.id));
  let id = base, n = 2;
  while (taken.has(id) || reserved.has(id)) id = `${base}-${n++}`;
  return id;
}
