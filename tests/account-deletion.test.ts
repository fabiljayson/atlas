import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { WELCOME_MESSAGE } from "../src/lib/chief";
import type { PersistedState } from "../src/lib/types";

// Point the database at a throwaway file BEFORE the singleton is created.
process.env.ATLAS_DB_PATH = path.join(
  mkdtempSync(path.join(tmpdir(), "atlas-test-")),
  "atlas-test.db",
);

type Db = typeof import("../src/lib/db");
let db: Db | null = null;

async function getDb(): Promise<Db> {
  if (!db) {
    db = await import("../src/lib/db");
  }
  return db;
}

function seedState(over: Partial<PersistedState> = {}): PersistedState {
  return {
    mails: [],
    events: [],
    tasks: [
      { id: "t-b", title: "User B task", due: "Today", urgency: "high", done: false },
    ],
    objectives: [],
    files: [],
    checkins: [],
    notifications: [],
    chat: [WELCOME_MESSAGE],
    drafts: [],
    ...over,
  };
}

test("deleteUserAccount removes all records, revokes sessions, spares other users", async () => {
  const {
    createUser,
    createSession,
    getSessionUser,
    saveUserState,
    loadUserState,
    deleteUserAccount,
    verifyCredentials,
    saveGoogleTokens,
    loadGoogleTokens,
  } = await getDb();

  const a = createUser("Alice Test", "alice@example.com", "longpassword1");
  const b = createUser("Bob Test", "bob@example.com", "longpassword2");
  assert.ok(a.ok && b.ok, "both users created");
  if (!a.ok || !b.ok) return;

  saveUserState(a.user.id, seedState());
  saveUserState(b.user.id, seedState());
  saveGoogleTokens(a.user.id, {
    accessToken: "atk",
    refreshToken: "rtk",
    expiresAt: Date.now() + 3600_000,
    scope: "gmail.readonly",
  });
  const tokenA = createSession(a.user.id);
  const tokenB = createSession(b.user.id);

  assert.equal(deleteUserAccount(a.user.id), true);

  // Session revoked: the token no longer resolves to any user.
  assert.equal(getSessionUser(tokenA), null);

  // All personal data gone.
  assert.equal(loadUserState(a.user.id), null);
  assert.equal(loadGoogleTokens(a.user.id), null);
  assert.equal(verifyCredentials("alice@example.com", "longpassword1").ok, false);

  // Other user untouched: state, session, credentials all intact.
  const bState = loadUserState(b.user.id);
  assert.ok(bState, "user B state intact");
  assert.equal(bState.tasks[0].title, "User B task");
  const bUser = getSessionUser(tokenB);
  assert.ok(bUser, "user B session survives");
  assert.equal(bUser.email, "bob@example.com");
  assert.equal(verifyCredentials("bob@example.com", "longpassword2").ok, true);
});

test("deleteUserAccount is a safe no-op for an already-deleted user", async () => {
  const { createUser, deleteUserAccount, verifyCredentials } = await getDb();

  const u = createUser("Carol Test", "carol@example.com", "longpassword3");
  assert.ok(u.ok, "user created");
  if (!u.ok) return;
  assert.equal(deleteUserAccount(u.user.id), true);
  assert.equal(deleteUserAccount(u.user.id), false);
  assert.doesNotThrow(() => deleteUserAccount(u.user.id));
  assert.equal(verifyCredentials("carol@example.com", "longpassword3").ok, false);
});

test("a second user's deletion never deletes shared rows of the first", async () => {
  const { createUser, saveUserState, loadUserState, createSession, getSessionUser, deleteUserAccount } =
    await getDb();

  const u1 = createUser("Dave Test", "dave@example.com", "longpassword4");
  const u2 = createUser("Eve Test", "eve@example.com", "longpassword5");
  assert.ok(u1.ok && u2.ok);
  if (!u1.ok || !u2.ok) return;
  saveUserState(u1.user.id, seedState());
  const t1 = createSession(u1.user.id);
  deleteUserAccount(u2.user.id);
  assert.notEqual(getSessionUser(t1), null);
  assert.notEqual(loadUserState(u1.user.id), null);
});
