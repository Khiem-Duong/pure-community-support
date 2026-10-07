-- Pure Community Support — admin database (Cloudflare D1).
--
-- Run once, either:
--   • D1 dashboard → purecommunitysupportd1db → Console → paste this file, or
--   • npx wrangler d1 execute purecommunitysupportd1db --remote --file=schema.sql
-- Safe to run again: it only creates what is missing.
--
-- First super-admin:
--   1. node scripts/hash-password.mjs   (type the password; it prints a hash)
--   2. In the D1 Console, run the INSERT the script prints, with your email and name.
-- Never put a plain password, or a hash, into a file in this repo.

-- People who can sign in to /admin. Roles follow spec §7.1.
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  name          TEXT    NOT NULL,
  role          TEXT    NOT NULL CHECK (role IN ('superadmin', 'editor', 'viewer')),
  password_hash TEXT    NOT NULL,            -- pbkdf2$<iterations>$<salt>$<hash>
  active        INTEGER NOT NULL DEFAULT 1,  -- 0 = cannot sign in
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

-- Signed-in sessions. Only a SHA-256 hash of each session token is stored;
-- the token itself lives in the person's cookie.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Sign-in attempts, used to pause sign-in after repeated failures.
CREATE TABLE IF NOT EXISTS login_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL,
  ip         TEXT,
  success    INTEGER NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_email ON login_attempts(email, created_at);
CREATE INDEX IF NOT EXISTS idx_attempts_ip    ON login_attempts(ip, created_at);
