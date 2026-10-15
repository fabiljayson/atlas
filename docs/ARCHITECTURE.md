# Architecture

Atlas is a single Next.js application with a thin server edge (auth) and a rich client core (dashboard).

## Big picture

```
┌────────────────────────────────────────────────────────────┐
│ Browser                                                    │
│                                                            │
│  Landing / Login / Signup          /app (dashboard)        │
│  (static)                          StoreProvider           │
│                                    │ hydrate + debounced    │
│                                    │ save /api/state        │
│                                    └─ Shell (nav, bell,    │
│                                       check-in modal)      │
│                                        └─ pages:           │
│                                           Today / Brain /  │
│                                           Studio / Objectives
└───────────────┬────────────────────────────┬───────────────┘
                │ fetch /api/auth/*          │ RSC / streamed auth
                │ fetch /api/state           │
                │ fetch /api/chief           │
┌───────────────▼────────────────────────────▼───────────────┐
│ Next.js server                                             │
│                                                            │
│  src/proxy.ts           Session-cookie gate (hard 307)     │
│  app/app/layout.tsx     Token → user + state hydration     │
│  api/auth/*             signup / login / logout            │
│  api/state              GET/PUT per-user dashboard state   │
│  api/chief              chief chat: LLM or rules           │
│  lib/db.ts              SQLite: users, sessions, user_state│
│  lib/askChief.ts        LLM call + rule fallback           │
│  lib/rateLimit.ts       in-memory login/signup throttles   │
└────────────────────────────────────────────────────────────┘
                │
        atlas.db (SQLite, WAL)
```

## Layers

### 1. Routing and rendering (`src/app`)

| Route | Rendering | Guard |
|---|---|---|
| `/` landing | Static (prerendered) | public |
| `/login`, `/signup` | Static | public |
| `/app/*` | Partial Prerender: static shell + streamed auth + state | `proxy.ts` then layout |
| `/api/auth/*` | Dynamic (Node) | public (validates credentials; rate limited) |
| `/api/state` | Dynamic (Node) | session cookie required |
| `/api/chief` | Dynamic (Node) | session cookie required |

`cacheComponents: true` is enabled. Anything touching cookies or the database must happen either inside a `<Suspense>` boundary (see `app/app/layout.tsx`) or in a route handler; static exports reject direct dynamic access at build time.

Two guards are deliberately redundant:

1. **`src/proxy.ts`** — runs before rendering, checks cookie *presence* only, returns a real HTTP 307 to `/login` for unauthenticated `/app/*` requests.
2. **`app/app/layout.tsx`** — validates the session token *against the database* and redirects if invalid. Catches stale/forged cookies the proxy cannot.

### 2. Client state (`src/lib/store.tsx`)

A single React context (`StoreProvider`) owns all dashboard state: tasks, mails, files, objectives, check-ins, notifications, chat and drafts. Actions (`toggleTask`, `submitCheckin`, `arrangeInbox`, `sendChat`…) live alongside state so pages stay declarative.

Boundaries:

- **Auth state is NOT in the store.** It is server-owned (cookie + layout).
- **State is hydrated from the database on login.** `app/app/layout.tsx` calls `getOrCreateUserState(user.id)` (seeding the welcome data on first access) and passes it to `StoreProvider`. Every mutation is saved back with a 500 ms debounce via `PUT /api/state`; the first render after hydration is skipped so seeding never overwrites stored data.
- **Persistence is a slice whitelist.** Only arrays named in `PERSISTED_SLICES` (`lib/types.ts`) round-trip; unknown keys are dropped server-side, keeping the schema honest as the store grows.

### 3. Intelligence (`src/lib/chief.ts`, `src/lib/askChief.ts`, `api/chief`)

Two layers behind one endpoint:

- **`POST /api/chief`** — session-gated route. Validates message length and a truncated context (tasks/objectives/files, max 200 items each), then calls `respondToChief`.
- **`src/lib/askChief.ts`** (server-only) — if any of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` is set, calls that provider's chat API (15 s timeout, system prompt constraining voice/length, user prompt embedding the real context), trying providers in order and defaulting Gemini to `gemini-3.1-flash-lite`. Any failure (bad key, timeout, quota, overload) falls through to the next provider, then the rules engine, so the endpoint never breaks.
- **`src/lib/chief.ts`** — `getChiefReply(query, ctx)` remains the deterministic rule-based responder (urgent / objectives / plan / content / search / file-name branches + fallback summary). The client keeps it imported as the network-error fallback in `store.sendChat`, so chat degrades gracefully offline. `ChatMessage` shape is unchanged across both engines.

### 4. Persistence and auth (`src/lib/db.ts`, `api/auth/*`)

- `node:sqlite` (`DatabaseSync`) with WAL, schema created idempotently on first use, singleton cached on `globalThis` to survive dev hot-reloads.
- Tables:
  - `users` (id, name, email unique nocase, password_hash, salt)
  - `sessions` (token_hash PK, user_id FK, expires_at)
  - `user_state` (user_id, slice, data JSON, updated_at; PK user_id+slice)
- Passwords: `scrypt(password, random 16-byte salt, 64)` stored hex; compared with `timingSafeEqual`.
- Sessions: 32-byte random token given to the client, stored **SHA-256 hashed**; expiry 30 days; deletion = revocation.
- State: `loadUserState` / `saveUserState` / `getOrCreateUserState` in `lib/db.ts`. Saves are transactional (`BEGIN`/`COMMIT`, `ROLLBACK` on error) batched upserts across the slice whitelist.
- **Rate limiting** (`lib/rateLimit.ts`): in-memory failure buckets with TTL sweep. Login checks per-account (5/15 min) and per-IP (20/15 min) before verifying, registers failures on bad credentials, clears the account bucket on success. Signups count all attempts (10/hour per IP). In-memory by design: single-process prototype; swap the map for Redis before multi-instance deploys.

### 5. Design system (`src/app/globals.css`, `components/ui.tsx`)

Tailwind v4 `@theme` tokens (no config file): colors `bg / panel / panel-2 / line / ink / ink-dim / ink-faint / indigo / indigo-deep / critical / urgent / good`, fonts `--font-sans` (Geist) and `--font-mono` (JetBrains Mono). Primitives (`Button`, `Panel`, `UrgencyBadge`, `Modal`, `Field`) live in `components/ui.tsx`; everything composes from these tokens. Fonts are self-hosted (`public/fonts`) because Next's Google-Font fetch is unreliable in this environment.

## Data flow examples

**Login:** form → `POST /api/auth/login` → rate-limit check → verify scrypt hash → create session row → `Set-Cookie` → `router.push("/app")` → proxy allows (cookie present) → layout validates token and loads `user_state` → StoreProvider hydrates.

**Task toggle:** checkbox → `toggleTask` in store → state updates immediately (optimistic) → debounced `PUT /api/state` persists the slice → survives logout/login.

**Chief chat:** message → `store.sendChat` posts to `/api/chief` with the current context → LLM (if keyed) or rules produce a reply → `ChatMessage` appended. On network failure the client answers from the local rules engine so the thread never stalls.

**Evening check-in:** modal in Shell → `submitCheckin` in store → new check-in + tomorrow task + notification → saved like any other slice → surfaces on Today page and the bell.

**File arrangement:** Brain page → `arrangeInbox` → store moves `Inbox` files folder-by-folder with a delay per file (visible filing) → notification.

## Extension points

| To add | Touch |
|---|---|
| Real Gmail/Calendar | OAuth route handlers + a server sync module; write results into `user_state` slices (needs `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`) |
| Brand settings screen | Studio's brand panel reads from a new store slice instead of literals |
| Shared rate-limit store | Replace the Map in `lib/rateLimit.ts` with a Redis/Upstash client; the call sites stay identical |
| Password reset / email verification | New token tables + mail sender; see `docs/SECURITY.md` roadmap |
