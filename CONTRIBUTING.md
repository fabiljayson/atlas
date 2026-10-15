# Contributing to Atlas

Thanks for helping improve Atlas. This document covers setup, conventions and what a good pull request looks like.

## Prerequisites

- **Node 24+** (the app uses the built-in `node:sqlite` module)
- npm (ships with Node)

## Setup

```bash
git clone <repo-url> atlas
cd atlas
npm install
npm run dev        # http://localhost:3000
```

The SQLite database (`atlas.db`) is created automatically on first signup. To reset all accounts, stop the dev server and delete `atlas.db*`.

## Before you open a PR

Both gates must pass:

```bash
npm run lint       # ESLint, zero errors
npm run build      # TypeScript check + production build
```

There is no test suite yet; if you add one, document how to run it in the README and this file.

## Conventions

**Stack boundaries**

- Next.js App Router with React Server Components by default; client interactivity requires `"use client"` in an isolated leaf component.
- Styling is Tailwind v4 utilities only, referencing tokens from `src/app/globals.css` (`bg-panel`, `text-ink-dim`, `border-line`…). Do not hard-code hex colors in components (brand swatches in the Studio are an intentional exception).
- One icon family: **Phosphor** (`@phosphor-icons/react`). No hand-drawn SVG icons, no emoji in UI.
- Fonts are self-hosted in `public/fonts`. Do not reintroduce `next/font/google` fetches.

**Architecture boundaries**

- Auth state lives on the server (cookie + `app/app/layout.tsx`), never in the client store.
- Dashboard state goes through `src/lib/store.tsx`; add state and actions there rather than local copies in pages.
- Server-only code (`lib/db.ts`, route handlers) must not be imported from client components.
- Any route touching cookies or the DB inside `app/` must sit inside `<Suspense>` or be a route handler, or the `cacheComponents` build will fail.

**Code style**

- Follow the patterns already in the file you are editing; match the surrounding component structure.
- UI primitives are in `src/components/ui.tsx` — extend them instead of duplicating button/panel markup.
- Accessibility: labels above inputs, errors below, focus-visible rings (already global), WCAG AA contrast for text and buttons.
- Motion must be motivated and must respect `prefers-reduced-motion`.

## Commits and PRs

- Commit messages: concise and imperative ("Add rate limiting to login", not "fixed stuff").
- Keep PRs focused: one concern per PR; describe the change, the why, and how you verified it (`lint`, `build`, manual flow if UI changed).
- Screenshots or a short clip for visual changes are very welcome.
- Update `CHANGELOG.md` under an `Unreleased` heading for user-visible changes.

## Reporting bugs

Open an issue with reproduction steps, expected vs. actual behavior, and your environment (OS, Node version). For security issues, follow `docs/SECURITY.md` instead — do not file public issues for exploitable vulnerabilities.
