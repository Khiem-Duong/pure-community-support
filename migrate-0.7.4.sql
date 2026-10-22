/* Pure Community Support — one-time update of the users table for 0.7.4 (People & roles).

   Run ONCE in the D1 dashboard → purecommunitysupportd1db → Console, BEFORE the 0.7.4 code is
   deployed (the new code reads the new column). Everyone is signed out and signs in again
   with the same email and password; nothing else changes.

   What it does: allows the "custom" role, and adds the permissions column and the
   must_change_password flag (set for managers added with a one-time password). SQLite can't
   change the allowed roles on an existing table, so the table is copied into a new one with
   the same ids:
     1. copy every account into users_new
     2. note who last edited each product (dropping users would clear products.updated_by)
     3. replace users with users_new
     4. put products.updated_by back
   Comments use this block style (not "--") so the file still works when the Console joins it
   onto one line. */

PRAGMA defer_foreign_keys = true;

CREATE TABLE users_new (
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

INSERT INTO users_new (id, email, role, password_hash, active, created_at, last_login_at)
  SELECT id, email, role, password_hash, active, created_at, last_login_at FROM users;

CREATE TABLE product_editors_keep AS
  SELECT id, updated_by FROM products WHERE updated_by IS NOT NULL;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

UPDATE products
  SET updated_by = (SELECT k.updated_by FROM product_editors_keep k WHERE k.id = products.id)
  WHERE id IN (SELECT id FROM product_editors_keep);
DROP TABLE product_editors_keep;

/* Check: lists every account with its role (password hashes are left out). */
SELECT id, email, role, active FROM users ORDER BY id;
