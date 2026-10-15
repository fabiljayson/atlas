# AGENTS.md

Instructions for AI agents working in this repository.

## What this is

Atlas: a personal command-center dashboard (Next.js App Router) with five pillars — urgency triage, second brain, evening check-in, content studio, objectives + chief-of-staff chat — plus real email/password auth over SQLite and per-user persistence of all dashboard data. Dark indigo/grey theme, calm/professional. Auth, persistence and rate limiting are real; the dashboard is fed by real Google sources (Gmail, Calendar, Tasks, Drive) when OAuth keys are present, with empty states otherwise; the AI chief uses an LLM when keyed, rules otherwise.

## Commands

```bash
npm run dev        # dev server (port 3000; existing sessions may use other ports)
npm run lint       # ESLint — must be zero errors
npm run build      # TypeScript check + production build — must pass
npm run test       # node:test suite (tests/, uses tsx + throwaway DB)
```

**Run `npm run lint` and `npm run build` before declaring any task done.** There is no test suite. Node 24+ required (`node:sqlite`).

## Map

| Concern | File |
|---|---|
| Design tokens (colors, fonts) | `src/app/globals.css` (`@theme`) |
| Logo mark (`public/logo.png`, favicon) | `src/components/Logo.tsx` (`LogoMark`) |
| UI primitives (Button, Panel, Badge, Modal, Field) | `src/components/ui.tsx` |
| Nav shell, bell, check-in modal, sign-out | `src/components/Shell.tsx` |
| Global client state + all actions | `src/lib/store.tsx` |
| Google sync (Gmail, Calendar, Tasks, Drive) | `src/lib/google.ts` + `src/app/api/{google/*,sync}/route.ts` |
| Chief-of-staff replies (rule-based) | `src/lib/chief.ts` |
| SQLite + auth + per-user state primitives | `src/lib/db.ts` (server-only) |
| Rate limiting (login/signup/delete-reauth) | `src/lib/rateLimit.ts` |
| Account deletion (reauth + transaction) | `src/app/api/account/delete/route.ts` + `deleteUserAccount` in `src/lib/db.ts` |
| Account settings page | `src/app/app/settings/` |
| Legal pages (`/legal` `/privacy` `/terms` `/cookies`) | `src/app/{legal,privacy,terms,cookies}/page.tsx` + `src/components/legal.tsx` (`Ph` placeholder marker) |
| Auth endpoints | `src/app/api/auth/{signup,login,logout}/route.ts` |
| Per-user state GET/PUT | `src/app/api/state/route.ts` |
| Chief chat endpoint (LLM or rules) | `src/app/api/chief/route.ts` + `src/lib/askChief.ts` (server-only) |
| Route guard (cookie presence) | `src/proxy.ts` |
| Session validation + dashboard layout | `src/app/app/layout.tsx` |
| Landing / login / signup | `src/app/page.tsx`, `src/app/{login,signup}/page.tsx` |
| Dashboard pages | `src/app/app/{page,brain,studio,objectives}/page.tsx` |
| Docs | `README.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md` |

## Hard rules

1. **Theme lock:** dark only. Use existing tokens (`bg`, `panel`, `panel-2`, `line`, `ink`, `ink-dim`, `ink-faint`, `indigo`, `indigo-deep`, `critical`, `urgent`, `good`). One accent (indigo). No purple AI gradients, no second icon family (Phosphor only), no emoji in UI.
2. **Auth/server boundary:** never import `lib/db.ts` or route-handler code into client components. Auth state stays server-owned; dashboard state goes through `StoreProvider`.
3. **`cacheComponents` is on:** dynamic access (cookies, DB) must be inside `<Suspense>` or a route handler; no `export const runtime` in routes (build error).
4. **Fonts:** self-hosted via `@font-face` in `globals.css` + files in `public/fonts`. Never `next/font/google` (network fetch fails in this environment).
5. **Store pattern:** new dashboard data = state + action in `store.tsx`, consumed via `useStore()`. Do not scatter `useState` copies of shared data into pages.
6. **Chief chat:** client posts to `/api/chief` via `store.sendChat`; `getChiefReply` in `lib/chief.ts` is the deterministic fallback (client-side network errors, server-side LLM absence/failure). Keep the `ChatMessage` shape identical across engines; never import `askChief.ts` client-side.
7. **Animation:** `motion/react`, `transform`/`opacity` only, must honor `prefers-reduced-motion` (use `useReducedMotion`).
8. **A11y:** labels above inputs, errors below, WCAG AA contrast, focus-visible is global.

## Conventions

- Copy voice: calm, direct, professional. Short sentences. No hype, no emoji, no em-dashes in new UI copy.
- Dates/times in render paths: use `useSyncExternalStore` (see `useTodayLabel` in `app/app/page.tsx`) — `new Date()` or `Date.now()` directly in a client render/`useState` initializer fails the prerender check.
- Route hrefs are `/app`, `/app/brain`, `/app/studio`, `/app/objectives`, `/app/settings` (dashboard), `/`, `/login`, `/signup`, and `/legal` `/privacy` `/terms` `/cookies` (public, static).
- Legal pages use `Ph` (placeholder marker) from `components/legal.tsx` for every unconfirmed business fact. Never invent operator identity, hosting, pricing or jurisdiction details.
- Sidebar footer shows the server-provided `user` prop; keep it flowing from `app/app/layout.tsx` → `Shell`.
- DB migrations are not versioned; schema is created idempotently in `lib/db.ts` `getDb()`. Add new tables/idioms there and document in `docs/ARCHITECTURE.md` and `docs/PRIVACY_DATA_MAP.md`.
- After schema or behavior changes, update the relevant doc (`ARCHITECTURE`, `SECURITY`, `CHANGELOG`).

## Phase-2 status (2026-10-15)

Shipped: per-user persistence (`user_state` + `/api/state` + debounced store save), login/signup rate limiting (`lib/rateLimit.ts`), LLM-ready chief (`/api/chief` + `askChief.ts`, rules fallback, keys via `.env.local` — see `.env.example`).

Remaining: Gmail/Calendar/Tasks/Drive sync is fully wired (blocked only on real `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`); password reset and email verification (see `docs/SECURITY.md` roadmap).

Live keys: `.env.local` carries `GEMINI_API_KEY` (chief of staff answers via `gemini-3.1-flash-lite`). Never commit `.env.local`; use `.env.example` as the template.
