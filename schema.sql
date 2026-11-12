CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  role          TEXT    NOT NULL CHECK (role IN ('superadmin', 'editor', 'viewer', 'custom')),
  permissions   TEXT,
  password_hash TEXT    NOT NULL,
  must_change_password INTEGER NOT NULL DEFAULT 0 CHECK (must_change_password IN (0, 1)),
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS login_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL,
  ip         TEXT,
  success    INTEGER NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_attempts_email ON login_attempts(email, created_at);

CREATE INDEX IF NOT EXISTS idx_attempts_ip    ON login_attempts(ip, created_at);

CREATE TABLE IF NOT EXISTS tags (
  id         TEXT    PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 80),
  name       TEXT    NOT NULL UNIQUE COLLATE NOCASE CHECK (length(name) BETWEEN 1 AND 60),
  name_vi    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id             TEXT    PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 80),
  name           TEXT    NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  name_vi        TEXT,
  description    TEXT,
  description_vi TEXT,
  price_cents    INTEGER CHECK (price_cents BETWEEN 0 AND 10000000),
  maker          TEXT,
  material       TEXT,
  material_vi    TEXT,
  colour         TEXT,
  colour_vi      TEXT,
  shown          INTEGER NOT NULL DEFAULT 1 CHECK (shown IN (0, 1)),
  is_new         INTEGER NOT NULL DEFAULT 0 CHECK (is_new IN (0, 1)),
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_by     INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_shown ON products(shown, sort_order);

CREATE TABLE IF NOT EXISTS product_tags (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     TEXT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag_id);

CREATE TABLE IF NOT EXISTS campaigns (
  id          TEXT    PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 80),
  title       TEXT    NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  title_vi    TEXT,
  status      TEXT    NOT NULL DEFAULT 'planned' CHECK (status IN ('running', 'planned')),
  focus       TEXT,
  location    TEXT,
  format      TEXT,
  summary     TEXT,
  summary_vi  TEXT,
  about       TEXT,
  about_vi    TEXT,
  covers      TEXT,
  covers_vi   TEXT,
  shown       INTEGER NOT NULL DEFAULT 1 CHECK (shown IN (0, 1)),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_by  INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_campaigns_shown ON campaigns(shown, sort_order);

CREATE TABLE IF NOT EXISTS cases (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id TEXT    NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name        TEXT    NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  name_vi     TEXT,
  story       TEXT,
  story_vi    TEXT,
  support     TEXT,
  consent     INTEGER NOT NULL CHECK (consent = 1),
  consent_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  consent_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  shown       INTEGER NOT NULL DEFAULT 1 CHECK (shown IN (0, 1)),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_by  INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cases_campaign ON cases(campaign_id, sort_order);