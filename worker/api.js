/* Shared pieces of the admin data API (/admin/api/*), used by catalog.js and people.js. */

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
