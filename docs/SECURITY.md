# Security

This document describes how Atlas protects accounts today and what remains for a production hardening pass.

## Authentication model

### Passwords

- Hashed with **scrypt** (`node:crypto`), 64-byte output, cost defaults (N=16384, r=8, p=1).
- Each password gets a **16-byte random salt**, stored alongside the hash (never a shared/static salt).
- Verification uses **`timingSafeEqual`** to avoid timing side channels.
- Minimum length enforced server-side (8 characters), independent of the UI.
- Passwords are never logged, never returned by any API, never placed in URLs.

### Sessions

- Session token: **32 bytes from `crypto.randomBytes`**, issued on signup/login.
- The database stores only the **SHA-256 hash** of the token, so a leaked database dump cannot be replayed as live sessions.
- Cookie: `atlas_session`, **`HttpOnly`**, **`SameSite=Lax`**, `Path=/`, 30-day expiry, **`Secure`** flag in production.
- Server-side expiry check on every validation; expired rows are deleted on read.
- Logout deletes the session row (revocation) and clears the cookie — valid on all devices because validation is DB-backed.

### Rate limiting

- **Login** (`POST /api/auth/login`): before credentials are checked, the request is tested against two in-memory buckets — **per account** (5 consecutive failures per 15 minutes) and **per IP** (20 consecutive failures per 15 minutes). Exceeding either returns `429` with a `Retry-After` header. A successful login clears the account bucket so a legitimate user is never locked out by an old failure streak.
- **Signup** (`POST /api/auth/signup`): at most 10 attempts per IP per hour (counted regardless of outcome), to slow mass account creation.
- Implementation: `src/lib/rateLimit.ts`. In-memory and per-process by design at this stage; a multi-instance deploy must move the counters to a shared store (Redis/Upstash) before these limits can be relied on.

### Route protection (defense in depth)

1. **`src/proxy.ts`** — pre-render gate. `/app/*` without a session cookie receives a hard `307` to `/login` before any dashboard HTML exists.
2. **`app/app/layout.tsx`** — validates the token against the database on every request (streamed inside `Suspense`). Stale or forged cookies are rejected even if a cookie is present.

### Credential handling

- Login failures return the same message for unknown email and wrong password (`Invalid email or password.`) to avoid account enumeration; rate-limit responses do not reveal whether the account exists (the same `429` fires on the per-IP bucket).
- Signup returns `409` for an existing email — an accepted trade-off for this product stage; flagged as a hardening item below.
- All input is validated server-side in the route handlers (email shape, name length, password length) before touching the database.
- All SQL uses **prepared statements** (no string interpolation), so inputs cannot inject SQL.
- `GET/PUT /api/state` and `POST /api/chief` require a valid session; the state endpoint enforces a slice whitelist, array-shaped values and a 2 MB cap, so a client cannot write arbitrary keys or oversized blobs.

### AI chief of staff

- The LLM is called server-side only (`src/lib/askChief.ts`, reached via session-gated `POST /api/chief`); provider keys (Gemini, OpenAI, Anthropic) live in environment variables and never reach the browser. The Gemini key is sent as an `x-goog-api-key` header, never in a URL or client code.
- The prompt embeds the user's own tasks, objectives and file summaries (file summaries are truncated to 160 characters, lists capped), and the system prompt forbids anything beyond short, professional answers.
- No key configured, or any provider failure (bad key, timeout, quota, 5xx): the endpoint silently falls through to the next configured provider, then to the deterministic rule engine. Nothing errors out, nothing leaks.

## Transport and browser-level protections

- Auth cookies are `Secure` when `NODE_ENV=production`; deploy behind HTTPS.
- `SameSite=Lax` blocks cross-site POSTs carrying the session cookie (CSRF mitigation for state-changing routes).
- All app pages render under Next's default security headers; add HSTS/CSP at the reverse proxy for production (see roadmap).
- The database file (`atlas.db`) is excluded from version control via `.gitignore`; `.env.local` (keys) is excluded, `.env.example` is committed with placeholders only.

## Known limitations (roadmap before production)

| Gap | Plan |
|---|---|
| ~~No rate limiting / lockout on `/api/auth/login`~~ | Done in 0.2.0 (in-memory, per-process); move to a shared store for multi-instance |
| No password reset or email verification | Add tokenized reset flow + verification mail |
| Signup reveals existing accounts (409) | Move to neutral "check your email" flow when mail sending exists |
| No CSRF token (relies on SameSite) | Add origin checks if cookie policy ever changes |
| No audit log of logins/sessions | Append-only auth events table |
| No CSP / HSTS headers in app config | Configure at proxy or via `headers()` in `next.config.ts` |
| Gmail/Calendar OAuth not wired | Needs real `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`; scopes kept read-only |
| Dev runs plain HTTP | Expected locally; production must terminate TLS upstream |

## Reporting a vulnerability

Open a private security advisory on the repository (or contact the maintainer directly). Please include reproduction steps and impact; expect an acknowledgment within a few days. Do not file public issues for exploitable vulnerabilities.
