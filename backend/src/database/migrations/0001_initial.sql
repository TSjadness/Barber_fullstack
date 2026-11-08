-- Schema local baseado nas tabelas public.app_state, public.bookings e user_roles do Supabase.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS app_state (
 id INTEGER PRIMARY KEY CHECK(id = 1),
 shop TEXT NOT NULL CHECK(json_valid(shop)),
 services TEXT NOT NULL CHECK(json_valid(services)),
 staff TEXT NOT NULL CHECK(json_valid(staff)),
 notices TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(notices)),
 payments TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(payments)),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS bookings (
 id TEXT PRIMARY KEY, date TEXT NOT NULL, time TEXT NOT NULL,
 staff_id TEXT NOT NULL, service_id TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'confirmado',
 data TEXT NOT NULL CHECK(json_valid(data)),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_bookings_staff_date ON bookings(staff_id,date);
CREATE TABLE IF NOT EXISTS local_users (
 id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'owner' CHECK(role IN ('owner'))
);
CREATE TABLE IF NOT EXISTS local_sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES local_users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS local_password_resets (
 code_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES local_users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
