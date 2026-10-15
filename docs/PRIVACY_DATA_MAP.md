# Personal data map

Field-level inventory of the SQLite database and every other place personal data can
exist, current as of October 2026. Schema is created idempotently in `src/lib/db.ts`
(`getDb()`); migrations are not versioned. If the schema changes, update this file.

Database: single-file SQLite (`atlas.db`, WAL mode, git-ignored). Auth state is
server-owned and never reaches the client except as `{ id, name, email }` returned to a
logged-in session.

## Tables

### `users`

| Field | Purpose | Necessary? | Legal basis | Retention | Deletion |
|---|---|---|---|---|---|
| `id` | Row identity | Yes | Contract | As long as account exists | Deleted with the row |
| `name` | Display name in the UI | Yes (harmless but used everywhere in UI) | Contract | Until account deletion | Deleted with the row |
| `email` | Login identity, rate-limit key | Yes | Contract | Until account deletion | Deleted with the row |
| `password_hash` + `salt` | Authentication (scrypt, per-user salt) | Yes | Contract / security | Until account deletion | Deleted with the row |
| `created_at` | Bookkeeping | Yes (ordering/debug) | Contract | Until account deletion | Deleted with the row |

### `sessions`

| Field | Purpose | Legal basis | Retention | Deletion |
|---|---|---|---|---|
| `token_hash` (SHA-256 of the cookie token) | Validate the session cookie without storing replayable tokens | Contract / security | 30-day TTL | Row deleted on logout, on expiry (lazy), on account deletion |
| `user_id` | Link to user | Contract | Same | Cascade + explicit delete |
| `expires_at` | Server-side expiry | Security | Same | Cleaned lazily on read |

### `user_state`

One row per user per slice; `data` holds a JSON array. Storage for everything the user
creates in the dashboard.

| Slice | Contains | Legal basis | Retention |
|---|---|---|---|
| `mails` | Synced Gmail snapshot (sender, subject, preview, urgency) | Contract (+ consent at connect time) | Until user clears / account deletion |
| `events` | Synced Calendar snapshot | Same | Same |
| `tasks` | User tasks incl. ones created from check-ins | Contract | Until user deletes / account deletion |
| `objectives` | Goals + key results | Contract | Same |
| `files` | File metadata + short summaries (Drive sync or seeded demo content) | Contract (+ consent for Drive) | Same |
| `checkins` | Evening check-in answers | Contract | Same |
| `notifications` | In-app notifications | Contract | Same |
| `chat` | Chief-of-staff conversation | Contract | Same |
| `drafts` | Content studio drafts | Contract | Same |

Access: written by the authenticated user's own client (debounced `PUT /api/state`,
slice-whitelisted, 2 MB cap); never readable by another user (session-bound queries).

### `google_tokens`

| Field | Purpose | Legal basis | Retention |
|---|---|---|---|
| `access_token` / `refresh_token` / `expires_at` / `scope` | Refreshable read-only Google API access after explicit connect | Consent (revocable at Settings disconnect or in Google's account page) | Until disconnect (`DELETE /api/google/disconnect`) or account deletion |

## Data outside the database

| Location | Content | Retention |
|---|---|---|
| `atlas_session` cookie | Random 32-byte token, HttpOnly, SameSite=Lax | 30 days client-side; server row above |
| Rate-limit buckets (`lib/rateLimit.ts`, in-memory) | Keys like `login:email:<address>` and `login:ip:<ip>`, failure counts | 5–60 minute windows; process memory only, never the DB |
| Backup copies of `atlas.db` | Whatever the operator makes | **Operator responsibility; must be documented before production** |
| AI provider servers | Prompts sent by a chat message (user message + truncated context) | Per provider terms; cannot be recalled by Atlas deletion |

## Deletion behavior

`deleteUserAccount(userId)` in `lib/db.ts` removes every row belonging to the user in a
single transaction — `sessions`, `user_state`, `google_tokens`, then `users` — preceded by
password reauthentication at `POST /api/account/delete`. Repeated calls are a no-op.
Other users' rows are never touched (covered by tests in `tests/account-deletion.test.ts`).

Known limits (disclosed in the privacy policy and the deletion dialog):

- Copies already sent to an AI provider by chat messages cannot be recalled.
- Operator-side backups of the SQLite file retain data until the operator's backup policy
  expires; that policy does not exist yet.
