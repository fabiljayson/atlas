# Changelog

All notable changes to Atlas are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-10-15

Persistence, rate limiting and an LLM-ready chief of staff.

### Added

- **Per-user persistence** — tasks, mails, events, objectives, files, check-ins, notifications, chat and drafts are stored per account in a new `user_state` table. The store hydrates from the server on login and saves debounced (500 ms) via `PUT /api/state`.
- **`GET/PUT /api/state`** — authenticated endpoints that validate the slice whitelist, array shape and a 2 MB cap before merging into the stored state.
- **AI chief of staff** — `POST /api/chief` runs server-side: with `GEMINI_API_KEY`, `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` set it calls the LLM (15 s timeout, tried in order, any failure falls through), otherwise falls back to the deterministic rules engine. The chat now streams through this endpoint; the rules engine remains as the client-side network-error fallback. Default Gemini model: `gemini-3.1-flash-lite`. See `.env.example`.
- **Login rate limiting** — in-memory throttling per IP (20 failures / 15 min) and per account (5 failures / 15 min) on `POST /api/auth/login`, returning `429` with `Retry-After`. Successful logins clear the account counter. Signups are limited to 10 per IP per hour.
- `.env.example` documenting the optional LLM and Google OAuth keys; `.gitignore` now allows committing it.

### Changed

- First login after signup seeds the user's state from the welcome data, so a new account starts from the same world the demo account shows.
- The chief chat no longer waits an artificial 900 ms before answering.

### Fixed

- Dates and "today" labels no longer break prerendering (`useSyncExternalStore` instead of `new Date()` in render paths).

### Known limitations

- Gmail/Calendar sync is scaffolded but inert until Google OAuth credentials are provided.
- Rate limiting is in-memory (single process); move to a shared store before multi-instance deploys.
- No password reset or email verification yet (see `docs/SECURITY.md`).

## [0.1.0] - 2026-10-15

First release: landing, accounts and the full five-pillar prototype.

### Added

- **Today dashboard** — mail, calendar and tasks unified and classified by urgency, with a live "Now" strip and stat tiles.
- **Second brain** — folder tree, file previews with summaries/excerpts/tags, "AI organize" that files unsorted Inbox items, Q&A chat citing source files.
- **Evening check-in** — what worked / what stuck / what tomorrow, saved as a check-in, a dashboard task and a notification.
- **Content studio** — brand panel (logo, indigo/grey palette, Geist + JetBrains Mono, voice rules), three card styles, post + newsletter previews, "Create content" generation flow.
- **Objectives** — goals with key-result progress, "New objective" creation, and the chief-of-staff chat (search, write, read) fed by the top-bar search.
- **Landing page** at `/` with live product previews of each pillar.
- **Accounts** — signup (`/signup`), login (`/login`), logout; SQLite persistence (`atlas.db`), scrypt password hashing, hashed session tokens in HttpOnly cookies.
- **Route protection** — `src/proxy.ts` cookie gate plus database-backed session validation in the app layout.
- **Design system** — dark indigo/grey tokens on Tailwind v4 `@theme`, self-hosted Geist and JetBrains Mono, Phosphor icons, motion with `prefers-reduced-motion` support.
- Documentation: README, Architecture, Security, Contributing, Changelog, Agents; MIT license.

### Known limitations

- Dashboard content was mock-only in this release; per-user persistence landed in 0.2.0.
- No rate limiting, password reset or email verification yet (see `docs/SECURITY.md`). Rate limiting landed in 0.2.0.
