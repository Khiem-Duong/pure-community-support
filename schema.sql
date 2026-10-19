/* Pure Community Support — admin database (Cloudflare D1).

   Run once, either:
     • D1 dashboard → purecommunitysupportd1db → Console → paste this file, or
     • npx wrangler d1 execute purecommunitysupportd1db --remote --file=schema.sql
   Safe to run again: it only creates what is missing.
   Comments use this block style (not "--") so the file still works when the
   D1 Console joins it onto one line.

   First super-admin:
     1. node scripts/hash-password.mjs   (type the password; it prints a hash)
     2. In the D1 Console, run the INSERT the script prints, with your email.
   Never put a plain password, or a hash, into a file in this repo. */

/* People who can sign in to /admin. Roles follow spec §7.1.
   The admin shows the part of the email before the @ as the person's display name. */
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  role          TEXT    NOT NULL CHECK (role IN ('superadmin', 'editor', 'viewer')),
  password_hash TEXT    NOT NULL,            /* pbkdf2$<iterations>$<salt>$<hash> */
  active        INTEGER NOT NULL DEFAULT 1,  /* 0 = cannot sign in */
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

/* Signed-in sessions. Only a SHA-256 hash of each session token is stored;
   the token itself lives in the person's cookie. */
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

/* Sign-in attempts, used to pause sign-in after repeated failures. */
CREATE TABLE IF NOT EXISTS login_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL,
  ip         TEXT,
  success    INTEGER NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_email ON login_attempts(email, created_at);
CREATE INDEX IF NOT EXISTS idx_attempts_ip    ON login_attempts(ip, created_at);

/* ── Shop ──────────────────────────────────────
   Product data for the shop, edited in /admin (Products, Tags). All of it is public.
   Photos are not stored here: until R2 is connected, the shop takes each product's photo
   from assets/js/products.js by product id. The *_vi columns stay empty until the
   Vietnamese version is built (TODO); pages fall back to the English text. */

/* Tags, edited on the admin Tags screen; a product can have several.
   Replaces the shop's single "collection" per product. */
CREATE TABLE IF NOT EXISTS tags (
  id         TEXT    PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 80),  /* slug, e.g. "resort" */
  name       TEXT    NOT NULL UNIQUE COLLATE NOCASE CHECK (length(name) BETWEEN 1 AND 60),
  name_vi    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

/* Products. "shown" is the admin's Shown / Hidden switch: hidden products are left out
   of the shop grid, quick view, item pages and new order list additions. */
CREATE TABLE IF NOT EXISTS products (
  id             TEXT    PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 80),  /* slug, used in /shop/<id> */
  name           TEXT    NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  name_vi        TEXT,
  description    TEXT,
  description_vi TEXT,
  price_cents    INTEGER CHECK (price_cents BETWEEN 0 AND 10000000),       /* USD cents; NULL shows "Price TBD" */
  maker          TEXT,
  material       TEXT,
  material_vi    TEXT,
  colour         TEXT,
  colour_vi      TEXT,
  shown          INTEGER NOT NULL DEFAULT 1 CHECK (shown IN (0, 1)),      /* 1 = Shown, 0 = Hidden */
  is_new         INTEGER NOT NULL DEFAULT 0 CHECK (is_new IN (0, 1)),     /* "New" badge */
  sort_order     INTEGER NOT NULL DEFAULT 0,                              /* shop order, lowest first */
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_by     INTEGER REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_products_shown ON products(shown, sort_order);

/* Which tags each product has. Deleting a product or a tag removes its rows here. */
CREATE TABLE IF NOT EXISTS product_tags (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     TEXT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag_id);
