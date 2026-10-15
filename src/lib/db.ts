import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { WELCOME_MESSAGE } from "./chief";
import { PERSISTED_SLICES, type PersistedState } from "./types";

// Overridable so tests can run against a throwaway database file.
const DB_PATH = process.env.ATLAS_DB_PATH || path.join(process.cwd(), "atlas.db");

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
}

declare global {
  var __atlasDb: DatabaseSync | undefined;
}

function getDb(): DatabaseSync {
  if (!globalThis.__atlasDb) {
    const db = new DatabaseSync(DB_PATH);
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS user_state (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        slice TEXT NOT NULL,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, slice)
      );
      CREATE TABLE IF NOT EXISTS google_tokens (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at INTEGER NOT NULL,
        scope TEXT NOT NULL
      );
    `);
    globalThis.__atlasDb = db;
  }
  return globalThis.__atlasDb;
}

function hashPassword(password: string, salt: Buffer): string {
  return scryptSync(password, salt, 64).toString("hex");
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

export function createUser(
  name: string,
  email: string,
  password: string,
): { ok: true; user: SessionUser } | { ok: false; error: string } {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());
  if (existing) return { ok: false, error: "An account with that email already exists." };

  const salt = randomBytes(16);
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, salt) VALUES (?, ?, ?, ?)")
    .run(
      name.trim(),
      email.trim().toLowerCase(),
      hashPassword(password, salt),
      salt.toString("hex"),
    );

  return {
    ok: true,
    user: { id: Number(info.lastInsertRowid), name: name.trim(), email: email.trim().toLowerCase() },
  };
}

export function verifyCredentials(
  email: string,
  password: string,
): { ok: true; user: SessionUser } | { ok: false; error: string } {
  const db = getDb();
  const row = db
    .prepare("SELECT id, name, email, password_hash, salt FROM users WHERE email = ?")
    .get(email.trim().toLowerCase()) as UserRow | undefined;

  if (!row) return { ok: false, error: "Invalid email or password." };

  const salt = Buffer.from(row.salt, "hex");
  const candidate = Buffer.from(hashPassword(password, salt), "hex");
  const stored = Buffer.from(row.password_hash, "hex");

  if (candidate.length !== stored.length || !timingSafeEqual(candidate, stored)) {
    return { ok: false, error: "Invalid email or password." };
  }

  return { ok: true, user: { id: row.id, name: row.name, email: row.email } };
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function createSession(userId: number): string {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(
    sha256(token),
    userId,
    Date.now() + SESSION_TTL_MS,
  );
  return token;
}

export function getSessionUser(token: string): SessionUser | null {
  if (!token) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.name, u.email, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ?`,
    )
    .get(sha256(token)) as
    | { id: number; name: string; email: string; expires_at: number }
    | undefined;

  if (!row) return null;
  if (row.expires_at < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
    return null;
  }
  return { id: row.id, name: row.name, email: row.email };
}

export function destroySession(token: string): void {
  if (!token) return;
  getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function defaultState(): PersistedState {
  return {
    mails: [],
    events: [],
    tasks: [],
    objectives: [],
    files: [],
    checkins: [],
    notifications: [],
    chat: [WELCOME_MESSAGE],
    drafts: [],
  };
}

export function loadUserState(userId: number): PersistedState | null {
  const rows = getDb()
    .prepare("SELECT slice, data FROM user_state WHERE user_id = ?")
    .all(userId) as { slice: string; data: string }[];

  if (rows.length === 0) return null;

  const loaded: Partial<PersistedState> = {};
  for (const row of rows) {
    if ((PERSISTED_SLICES as string[]).includes(row.slice)) {
      (loaded as Record<string, unknown>)[row.slice] = JSON.parse(row.data);
    }
  }
  return { ...defaultState(), ...loaded };
}

export function saveUserState(userId: number, state: PersistedState): void {
  const db = getDb();
  const now = Date.now();
  const upsert = db.prepare(
    `INSERT INTO user_state (user_id, slice, data, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, slice) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
  );
  db.exec("BEGIN");
  try {
    for (const slice of PERSISTED_SLICES) {
      const value = (state as unknown as Record<string, unknown>)[slice];
      if (Array.isArray(value)) {
        upsert.run(userId, slice, JSON.stringify(value), now);
      }
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getOrCreateUserState(userId: number): PersistedState {
  const existing = loadUserState(userId);
  if (existing) return existing;
  const seeded = defaultState();
  saveUserState(userId, seeded);
  return seeded;
}

export interface GoogleTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
  scope: string;
}

export function saveGoogleTokens(userId: number, tokens: GoogleTokens): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO google_tokens (user_id, access_token, refresh_token, expires_at, scope)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       access_token = excluded.access_token,
       refresh_token = COALESCE(excluded.refresh_token, google_tokens.refresh_token),
       expires_at = excluded.expires_at,
       scope = excluded.scope`,
  ).run(userId, tokens.accessToken, tokens.refreshToken, tokens.expiresAt, tokens.scope);
}

export function loadGoogleTokens(userId: number): GoogleTokens | null {
  const row = getDb()
    .prepare(
      "SELECT access_token, refresh_token, expires_at, scope FROM google_tokens WHERE user_id = ?",
    )
    .get(userId) as
    | { access_token: string; refresh_token: string | null; expires_at: number; scope: string }
    | undefined;
  if (!row) return null;
  return {
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    expiresAt: row.expires_at,
    scope: row.scope,
  };
}

export function deleteGoogleTokens(userId: number): void {
  getDb().prepare("DELETE FROM google_tokens WHERE user_id = ?").run(userId);
}

/**
 * Delete every record belonging to a user, in one transaction.
 *
 * The users row is removed last; FK cascades are supplemented by explicit
 * deletes so the operation does not depend on the foreign_keys pragma being
 * enabled. Repeated calls for a missing user are a safe no-op.
 */
export function deleteUserAccount(userId: number): boolean {
  const db = getDb();
  const exists = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!exists) return false;

  db.exec("BEGIN");
  try {
    const del = (table: string, column: string): void => {
      db.prepare(`DELETE FROM ${table} WHERE ${column} = ?`).run(userId);
    };
    del("sessions", "user_id");
    del("user_state", "user_id");
    del("google_tokens", "user_id");
    del("users", "id");
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return true;
}
