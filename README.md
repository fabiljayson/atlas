# Atlas

**Your calm command center.** Mail, calendar and tasks classified by urgency, a second brain over your files, nightly check-ins, on-brand content generation and an AI chief of staff — one dark, focused dashboard.

## Features

| Pillar | What it does |
|---|---|
| **Today** | Mail, events and tasks unified and ranked by urgency (critical / high / normal / low), with a live "Now" strip |
| **Second brain** | Files auto-arranged into folders, per-file summaries and excerpts, Q&A that cites the source file |
| **Evening check-in** | Nightly ritual: what worked, what stuck, what tomorrow holds. Results land as tasks and notifications |
| **Content studio** | Posts and newsletters generated in your voice and rendered in your brand system (logo, colors, type) |
| **Objectives** | Goals with key-result progress, plus a chief of staff that searches, writes and reads across everything |
| **Accounts** | Real signup/login with SQLite persistence, hashed passwords, revocable sessions, login rate limiting |
| **Per-user data** | Tasks, files, objectives, check-ins, chat and drafts persist per account (`user_state` table, debounced saves) |
| **AI chief of staff** | Gemini by default (add `GEMINI_API_KEY`); also supports OpenAI/Anthropic. Falls back to rules when no key works |
```bash
git clone <repo-url> atlas
cd atlas
npm install
npm run dev        # http://localhost:3000
```
## Tech stack

- **Next.js 16** (App Router, `cacheComponents`, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with tokens defined in `@theme` (`src/app/globals.css`)
- **node:sqlite** (built-in) for the database, **scrypt** (built-in) for password hashing
- **Motion** for entrance/scroll animation (respects `prefers-reduced-motion`)
- **Phosphor Icons** as the single icon family
- Fonts **Geist** + **JetBrains Mono**, self-hosted in `public/fonts`

## Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build (includes TypeScript check)
npm run lint       # ESLint
npm start          # serve the production build
```

Requirements: **Node 24+** (uses the built-in `node:sqlite` module). The database file `atlas.db` is created automatically on first signup.

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (public)
│   ├── login/ signup/        # Auth screens (public)
│   ├── app/                  # Dashboard, protected by proxy + layout
│   │   ├── page.tsx          # Today (urgency triage)
│   │   ├── brain/            # Second brain
│   │   ├── studio/           # Content studio
│   │   └── objectives/       # Objectives + chief of staff chat
│   └── api/
│       ├── auth/               # signup, login, logout handlers
│       ├── state/              # GET/PUT per-user dashboard state
│       └── chief/              # chief-of-staff chat (LLM or rules)
├── components/               # Shell, ui primitives, chat, auth
├── lib/
│   ├── db.ts                 # SQLite users/sessions/user_state + auth primitives
│   ├── store.tsx             # Global client state (hydrated + saved via /api/state)
│   ├── chief.ts              # Rule-based chief-of-staff responder (client fallback)
│   ├── askChief.ts           # Server: LLM call with rule fallback
│   ├── rateLimit.ts          # In-memory login/signup throttling
│   └── data.ts               # Seed data (per-user DB seed + first-run defaults)
└── proxy.ts                  # Route guard: unauthenticated → /login
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — layers, data flow, rendering strategy
- [Security](docs/SECURITY.md) — auth model, protections, known limitations
- [Contributing](CONTRIBUTING.md) — setup, conventions, PR checklist
- [Changelog](CHANGELOG.md) — what changed per release
- [Agents](AGENTS.md) — instructions for AI agents working in this codebase
- [License](LICENSE) — MIT

## Status

v0.2: auth is real and dashboard data is **persisted per user** (tasks, files, objectives, check-ins, chat, drafts). Login attempts are rate limited. The chief of staff answers from a **real LLM (Gemini) when keyed**, with automatic fallback to the deterministic rules engine. Still to come: live Gmail/Calendar (needs Google OAuth credentials), password reset and email verification.

## Optional integrations

Copy `.env.example` to `.env.local`. Everything is optional; Atlas runs fully with no keys.

- **AI chief:** `GEMINI_API_KEY` (Google AI Studio; default model `gemini-3.1-flash-lite`, override with `GEMINI_MODEL`), or `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`. First configured provider is tried in order OpenAI → Anthropic → Gemini; any failure falls back to the next, then to rules.
- **Gmail/Calendar:** `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (scopes `gmail.readonly`, `calendar.readonly`; redirect URI `http://localhost:3000/api/google/callback`).

## License

[MIT](LICENSE)
