---
name: atlas
description: Atlas personal command-center (Next.js App Router + SQLite; mail/calendar/tasks ranked by urgency, second brain, evening check-in, content studio, AI chief-of-staff). Use for ANY task under /home/fabiljayson/Projects/atlas — covers dev commands, AI-provider fallback rules and uncommitted-tree caution.
---

# Atlas

"Calm command center": one dark dashboard with Today (mail/events/tasks urgency-ranked), a second brain over user files, an evening check-in ritual, a content studio rendering in the user's brand, objectives/KRs, and an AI chief of staff.

## Run

```bash
cd atlas && npm install && npm run dev    # http://localhost:3000
npm start                                 # serves the production build
```

Data is SQLite; per-user state lives in the `user_state` table with debounced saves.

## Conventions

- AI chief of staff: **Gemini by default** (`GEMINI_API_KEY`), OpenAI/Anthropic supported, and it must gracefully fall back to rules engines when no key works — never hard-remove the fallback path.
- Auth is real (hashed passwords, revocable sessions, login rate limiting): keep security paths intact when touching accounts.
- UI should stay calm/focused and dark — match the existing design language before restyling anything.

## State

4 commits, last touched 2026-10-15, **19 modified files uncommitted** — always `git status` first, don't commit user work-in-progress without asking.
