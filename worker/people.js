/* Pure Community Support — managers (the users table; see schema.sql), for the admin's
   People & roles screen (admin/home.html). Super-admins only.

   Managers are editor, viewer and custom accounts. Super-admin accounts aren't listed or
   changed here; they are managed in the D1 Console. Every change answers with the whole
   updated list, { people }:
     GET    /admin/api/people        every manager
     POST   /admin/api/people        add one: { email, role, permissions?, password, oneTime }
                                     (oneTime: the password works for their first sign-in only,
                                     then they must create their own; see /admin/setup)
     PUT    /admin/api/people/<id>   save one: { role, permissions?, password? }
                                     (a new password signs them out everywhere; it stays one-time
                                     if they haven't created their own yet)
     DELETE /admin/api/people/<id>   delete one (their sessions end with it) */

import { PAGES, parsePermissions } from './access.js';
import { ApiError, bad, json, oneLine, readJson } from './api.js';
import { PASSWORD_MAX, PASSWORD_RULES, hashPassword, passwordOk } from './auth.js';

const MANAGER_ROLES = new Set(['editor', 'viewer', 'custom']);
const EMAIL_MAX = 254;

export async function peopleApi(request, env, url, path, user) {
  try {
    return await peopleRoute(request, env, url, path, user);
  } catch (err) {
    if (err instanceof ApiError) return json({ error: err.message }, err.status);
    const message = String(err && err.message);
    if (/UNIQUE constraint failed: users\.email/.test(message)) {
      return json({ error: 'There is already an account with that email.' }, 409);
    }
    if (/no such column: (permissions|must_change_password)|CHECK constraint failed/.test(message)) {
      return json({ error: 'The users table needs updating first: run migrate-0.7.4.sql in the D1 Console.' }, 500);
    }
    console.error('people api error:', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}

async function peopleRoute(request, env, url, path, user) {
  if (user.role !== 'superadmin') throw new ApiError(403, 'Only super-admins can manage people.');
  const method = request.method;
  const [, rawId, extra] = path.slice('/admin/api/'.length).split('/');
  if (extra !== undefined) throw new ApiError(404, 'Not found');
  if (rawId !== undefined && !/^\d{1,10}$/.test(rawId)) throw new ApiError(404, 'Not found');
  const id = rawId === undefined ? undefined : Number(rawId);

  if (method === 'GET') {
    if (id !== undefined) throw new ApiError(404, 'Not found');
    return json({ people: await listPeople(env) });
  }

  if (request.headers.get('Origin') !== url.origin) throw new ApiError(403, 'Forbidden');
  const body = method === 'DELETE' ? {} : await readJson(request);
  if (method === 'POST' && id === undefined) await addPerson(env, body);
  else if (method === 'PUT' && id) await savePerson(env, id, body);
  else if (method === 'DELETE' && id) await deletePerson(env, id);
  else throw new ApiError(404, 'Not found');
  return json({ people: await listPeople(env) });
}

async function listPeople(env) {
  const { results } = await env.DB.prepare(`
    SELECT id, email, role, permissions, must_change_password, last_login_at
    FROM users WHERE role != 'superadmin' ORDER BY email`).all();
  return results.map(r => ({
    id: r.id,
    email: r.email,
    role: r.role,
    permissions: r.role === 'custom' ? parsePermissions(r.permissions) : {},
    oneTime: r.must_change_password === 1, // still has the one-time password
    lastLogin: r.last_login_at || null,
  }));
}

/* ── Checking what the admin sends ──────────── */

/* Role, and for Custom the pages with 'view' or 'edit' (stored as JSON). */
function cleanRole(body) {
  if (!MANAGER_ROLES.has(body.role)) throw bad('Choose a role: Editor, Viewer or Custom.');
  if (body.role !== 'custom') return { role: body.role, permissions: null };
  const raw = body.permissions;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw bad('That request could not be read.');
  const permissions = {};
  for (const [page, level] of Object.entries(raw)) {
    if (!PAGES.includes(page) || (level !== 'view' && level !== 'edit')) throw bad('That request could not be read.');
    permissions[page] = level;
  }
  if (!Object.keys(permissions).length) throw bad('Turn on at least one page for the custom role.');
  return { role: 'custom', permissions: JSON.stringify(permissions) };
}

/* The password as typed (spaces count), hashed; only the hash is stored. */
async function cleanPassword(value) {
  if (typeof value !== 'string') throw bad('The password must be text.');
  if (value.length > PASSWORD_MAX) throw bad(`The password is too long (up to ${PASSWORD_MAX} characters).`);
  if (!passwordOk(value)) throw bad(`Use ${PASSWORD_RULES} for the password.`);
  return hashPassword(value);
}

/* ── Changes ────────────────────────────────── */

async function addPerson(env, body) {
  // The email is only used to sign in, so any text works; sign-in ignores capitals.
  if (typeof body.email !== 'string') throw bad('Enter an email.');
  const email = oneLine(body.email).toLowerCase();
  if (!email) throw bad('Enter an email.');
  if (email.length > EMAIL_MAX) throw bad(`The email is too long (up to ${EMAIL_MAX} characters).`);
  const { role, permissions } = cleanRole(body);
  if (typeof body.oneTime !== 'boolean') throw bad('Choose a password mode.');
  await env.DB.prepare('INSERT INTO users (email, role, permissions, password_hash, must_change_password) VALUES (?, ?, ?, ?, ?)')
    .bind(email, role, permissions, await cleanPassword(body.password), body.oneTime ? 1 : 0).run();
}

/* Super-admin accounts can't be reached here, so the screen can't demote or delete one. */
async function findManager(env, id) {
  const row = await env.DB.prepare('SELECT role FROM users WHERE id = ?').bind(id).first();
  if (!row) throw new ApiError(404, 'That manager no longer exists. Someone may have deleted them.');
  if (row.role === 'superadmin') throw new ApiError(403, 'Super-admin accounts can only be changed in the D1 Console.');
}

async function savePerson(env, id, body) {
  await findManager(env, id);
  const { role, permissions } = cleanRole(body);
  const statements = [env.DB.prepare('UPDATE users SET role = ?2, permissions = ?3 WHERE id = ?1').bind(id, role, permissions)];
  if (body.password !== undefined) {
    statements.push(
      env.DB.prepare('UPDATE users SET password_hash = ?2 WHERE id = ?1').bind(id, await cleanPassword(body.password)),
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id),
    );
  }
  await env.DB.batch(statements);
}

async function deletePerson(env, id) {
  await findManager(env, id);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id),
    env.DB.prepare(`DELETE FROM users WHERE id = ? AND role != 'superadmin'`).bind(id),
  ]);
}
