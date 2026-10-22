/* Pure Community Support — Cloudflare Worker.

   Only requests matching "run_worker_first" in wrangler.jsonc (/admin, /admin/*, /api/*)
   reach this script; every other page is served straight from ./public.

   Bindings (set in wrangler.jsonc, available on `env`):
     env.ASSETS  the site files in ./public
     env.DB      D1 database (purecommunitysupportd1db), tables in schema.sql

   Public routes:
     GET  /api/products    the shop catalog: Shown products and their tags (cached ~1 minute)

   Admin routes:
     GET  /admin           signed-in dashboard (redirects to sign-in when signed out)
     GET  /admin/<screen>  the same dashboard opened at a screen: products, products/<id>,
                           products/new, tags, review, orders, people, people/<id>, people/new, ...
                           (see ADMIN_SCREEN); the page hides screens the person can't open
     GET  /admin/login     sign-in page
     POST /admin/login     check email + password, start a session; someone who signed in with a
                           one-time password (users.must_change_password) goes to /admin/setup
     GET  /admin/setup     first sign-in: create their own password (same page as sign-in, in
                           setup mode); until they do, every other admin page sends them here
     POST /admin/setup     save that password; the one-time password stops working
     POST /admin/logout    end the session
     GET  /admin/db-check  D1 connection check (remove once sign-in is confirmed working)

   Managers API (super-admins only): /admin/api/people, see worker/people.js.

   Admin data API (signed in; changes need edit access to Products or Tags (worker/access.js), and a
   same-origin JSON request). Every change answers with the whole updated catalog, { catalog: { products, tags } }:
     GET    /admin/api/catalog          every product (Shown and Hidden) and tag
     POST   /admin/api/products         add a product (its id is made from the name)
     PUT    /admin/api/products/<id>    save a product
     PATCH  /admin/api/products/<id>    switch Shown / Hidden: { shown }
     POST   /admin/api/products/batch   { action: 'delete', ids } | { action: 'price', ids, price }
                                        | { action: 'restore', products } (undo)
     POST   /admin/api/tags             add a tag
     PUT    /admin/api/tags/<id>        rename a tag
     DELETE /admin/api/tags/<id>        delete a tag (and remove it from its products) */

import { accessMap } from './access.js';
import { DUMMY_HASH, PASSWORD_MAX, PASSWORD_MIN, hashPassword, newSessionToken, sha256Hex, verifyPassword } from './auth.js';
import { adminApi, publicProducts } from './catalog.js';
import { peopleApi } from './people.js';
import loginTemplate from '../admin/login.html';
import homeTemplate from '../admin/home.html';

const SESSION_COOKIE = '__Host-pcs_admin';
const SESSION_HOURS = 12;
const LOCK_WINDOW = '-15 minutes';
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 20;

const ROLE_NAMES = { superadmin: 'Super-admin', editor: 'Editor', viewer: 'Viewer', custom: 'Custom' };

/* Dashboard screen paths; the page itself switches between them (admin/home.html). */
const ADMIN_SCREEN = /^\/admin\/(review|products|tags|orders|campaigns|impact|money|people|products\/[a-z0-9-]{1,80}|people\/(new|\d{1,10}))$/;

/* Messages shown on the sign-in page, chosen by ?m=<code>. Only these fixed texts are ever shown. */
const MESSAGES = {
  invalid:     { kind: 'error', text: 'The email or password is incorrect.' },
  locked:      { kind: 'error', text: 'Too many unsuccessful attempts. Please wait 15 minutes and try again.' },
  expired:     { kind: 'info',  text: 'Your session has ended. Please sign in again.' },
  out:         { kind: 'info',  text: 'You have been signed out.' },
  unavailable: { kind: 'error', text: 'Sign-in is temporarily unavailable. Please try again later.' },
  short:       { kind: 'error', text: `Use ${PASSWORD_MIN} to ${PASSWORD_MAX} characters for your password.` },
  mismatch:    { kind: 'error', text: 'The two passwords don’t match. Please type them again.' },
  same:        { kind: 'error', text: 'Choose a new password, different from the one-time password.' },
};

const BASE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/api/products') {
      try {
        return await publicProducts(request, env, ctx, url);
      } catch (err) {
        console.error('catalog error:', err);
        return Response.json({ error: 'The catalog is temporarily unavailable.' }, { status: 503, headers: BASE_HEADERS });
      }
    }

    // Anything else outside /admin: serve the normal site file.
    if (path !== '/admin' && !path.startsWith('/admin/')) return env.ASSETS.fetch(request);

    try {
      return await handleAdmin(request, env, ctx, url, path);
    } catch (err) {
      console.error('admin error:', err);
      return page(loginTemplate, { messageHtml: messageHtml('unavailable') }, 500);
    }
  },
};

async function handleAdmin(request, env, ctx, url, path) {
  const method = request.method;

  if (path === '/admin/db-check') {
    if (!env.DB) return Response.json({ db: 'not connected (no DB binding in wrangler.jsonc)' }, { status: 500, headers: BASE_HEADERS });
    const row = await env.DB.prepare('SELECT 1 AS ok').first();
    return Response.json({ db: row && row.ok === 1 ? 'connected' : 'unexpected response' }, { headers: BASE_HEADERS });
  }

  if (path === '/admin/login') {
    if (method === 'POST') return signIn(request, env, url);
    if (await currentUser(request, env)) return redirect('/admin');
    return page(loginTemplate, { messageHtml: messageHtml(url.searchParams.get('m')) });
  }

  if (path === '/admin/setup') {
    const user = await currentUser(request, env);
    if (!user) return redirect('/admin/login');
    if (!user.must_change_password) return redirect('/admin');
    if (method === 'POST') return setUpPassword(request, env, url, user);
    return page(loginTemplate, { mode: 'setup', email: user.email, messageHtml: messageHtml(url.searchParams.get('m')) });
  }

  if (path === '/admin/logout') {
    if (method !== 'POST') return redirect('/admin');
    if (!sameOrigin(request, url)) return forbidden();
    return signOut(request, env);
  }

  // Everything else under /admin needs a signed-in user.
  const user = await currentUser(request, env);
  const isApi = path.startsWith('/admin/api/');
  if (!user && isApi) return Response.json({ error: 'signed-out' }, { status: 401, headers: BASE_HEADERS });
  if (!user) {
    return getCookie(request, SESSION_COOKIE)
      ? redirect('/admin/login?m=expired', { 'Set-Cookie': sessionCookie('', 0) })
      : redirect('/admin/login');
  }

  // Signed in with a one-time password: nothing else until they've created their own.
  if (user.must_change_password) {
    if (isApi) return Response.json({ error: 'Create your own password first: reload this page.' }, { status: 403, headers: BASE_HEADERS });
    return redirect('/admin/setup');
  }

  if (isApi) {
    if (path === '/admin/api/people' || path.startsWith('/admin/api/people/')) return peopleApi(request, env, url, path, user);
    return adminApi(request, env, ctx, url, path, user);
  }

  if (path === '/admin' || ADMIN_SCREEN.test(path)) {
    return page(homeTemplate, {
      name: displayName(user.email),
      role: ROLE_NAMES[user.role] || user.role,
      roleKey: user.role,
      access: JSON.stringify(accessMap(user)),
    });
  }
  return new Response('Not found', { status: 404, headers: BASE_HEADERS });
}

/* ── Sign in / out ─────────────────────────── */

async function signIn(request, env, url) {
  if (!sameOrigin(request, url)) return forbidden();

  const form = await request.formData();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');
  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!email || !password) return redirect('/admin/login?m=invalid');
  if (await tooManyFails(env, email, ip)) return redirect('/admin/login?m=locked');

  const user = await env.DB
    .prepare('SELECT id, password_hash, must_change_password FROM users WHERE email = ? AND active = 1')
    .bind(email)
    .first();
  const passwordOk = await verifyPassword(password, user ? user.password_hash : DUMMY_HASH);
  const ok = Boolean(user) && passwordOk;

  await env.DB.prepare('INSERT INTO login_attempts (email, ip, success) VALUES (?, ?, ?)').bind(email, ip, ok ? 1 : 0).run();
  if (!ok) return redirect('/admin/login?m=invalid');
  return startSession(env, user.id, user.must_change_password ? '/admin/setup' : '/admin');
}

/* First sign-in: replaces the one-time password with their own. Their other sessions end,
   so anyone else who used the one-time password is signed out. */
async function setUpPassword(request, env, url, user) {
  if (!sameOrigin(request, url)) return forbidden();

  const form = await request.formData();
  const password = String(form.get('password') || '');
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) return redirect('/admin/setup?m=short');
  if (password !== String(form.get('repeat') || '')) return redirect('/admin/setup?m=mismatch');
  const row = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first();
  if (await verifyPassword(password, row.password_hash)) return redirect('/admin/setup?m=same');

  await env.DB.batch([
    env.DB.prepare('UPDATE users SET password_hash = ?2, must_change_password = 0 WHERE id = ?1')
      .bind(user.id, await hashPassword(password)),
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?')
      .bind(user.id, await sha256Hex(getCookie(request, SESSION_COOKIE))),
  ]);
  return redirect('/admin');
}

/* Sign-in pauses after repeated failures for this email or from this address. */
async function tooManyFails(env, email, ip) {
  const fails = await env.DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM login_attempts WHERE email = ?1 AND success = 0 AND created_at > datetime('now', ?3)) AS by_email,
      (SELECT COUNT(*) FROM login_attempts WHERE ip    = ?2 AND success = 0 AND created_at > datetime('now', ?3)) AS by_ip
  `).bind(email, ip, LOCK_WINDOW).first();
  return fails.by_email >= MAX_FAILS_PER_EMAIL || fails.by_ip >= MAX_FAILS_PER_IP;
}

async function startSession(env, userId, location) {
  const token = newSessionToken();
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, datetime('now', ?))`)
      .bind(await sha256Hex(token), userId, `+${SESSION_HOURS} hours`),
    env.DB.prepare(`UPDATE users SET last_login_at = datetime('now') WHERE id = ?`).bind(userId),
    // Housekeeping: drop expired sessions and old attempts.
    env.DB.prepare(`DELETE FROM sessions WHERE expires_at <= datetime('now')`),
    env.DB.prepare(`DELETE FROM login_attempts WHERE created_at < datetime('now', '-30 days')`),
  ]);

  return redirect(location, { 'Set-Cookie': sessionCookie(token, SESSION_HOURS * 3600) });
}

async function signOut(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run();
  return redirect('/admin/login?m=out', { 'Set-Cookie': sessionCookie('', 0) });
}

async function currentUser(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  return env.DB.prepare(`
    SELECT u.id, u.email, u.role, u.permissions, u.must_change_password
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND u.active = 1
  `).bind(await sha256Hex(token)).first();
}

/* ── Helpers ───────────────────────────────── */

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

/* __Host- cookies must be Secure, Path=/ and have no Domain: they can't be set by subdomains. */
function sessionCookie(value, maxAge) {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

/* Blocks forms posted from other websites. */
function sameOrigin(request, url) {
  return request.headers.get('Origin') === url.origin;
}

function redirect(location, extraHeaders = {}) {
  return new Response(null, { status: 303, headers: { ...BASE_HEADERS, Location: location, ...extraHeaders } });
}

function forbidden() {
  return new Response('Forbidden', { status: 403, headers: BASE_HEADERS });
}

/* Display name: the part of the email before the @ ("khiem" for khiem@example.com). */
const displayName = email => String(email).split('@')[0];

const escapeHtml = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function messageHtml(code) {
  const message = MESSAGES[code];
  if (!message) return '';
  return `<p class="msg msg-${message.kind}" role="${message.kind === 'error' ? 'alert' : 'status'}">${message.text}</p>`;
}

/* Fills {{placeholders}} in a template. Values are escaped, except keys ending in "Html"
   (built here from fixed strings) and the per-response script/style nonce. */
function page(template, vars, status = 200) {
  const nonce = newSessionToken();
  const html = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (key === 'nonce') return nonce;
    if (!(key in vars)) return '';
    return key.endsWith('Html') ? vars[key] : escapeHtml(vars[key]);
  });
  return new Response(html, {
    status,
    headers: {
      ...BASE_HEADERS,
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': [
        "default-src 'none'",
        "img-src 'self' blob:", // blob: previews a photo chosen in the product editor
        "connect-src 'self'",   // the dashboard saves products and tags through /admin/api
        `style-src 'nonce-${nonce}' https://fonts.googleapis.com`,
        'font-src https://fonts.gstatic.com',
        `script-src 'nonce-${nonce}'`,
        "form-action 'self'",
        "frame-ancestors 'none'",
        "base-uri 'none'",
      ].join('; '),
    },
  });
}
