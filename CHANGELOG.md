# Changelog

## 0.4.0 — Dark landing redesign + Google sync (October 2026)

### Added
- **Landing page redesign** (`src/app/page.tsx` now a server component with `metadata`;
  sections in `src/components/landing/`): sticky nav with anchor links, hero with labeled
  illustrative dashboard preview, problem framing, five pillar blocks, three-step story,
  chief-of-staff section (illustrative chat, provider/rules honesty note), evening
  check-in section, accurate security section, final CTA, footer. No fake testimonials,
  logos, or stats; previews carry an "Illustrative preview" label; skip-to-content link
  kept and restored to `<main id="main-content">`.
- **Google Tasks and Drive sync.** `fetchGoogleTasks` + `fetchDriveFiles` merge into
  second-brain files and objectives tasks (`mergeSyncedTasks`), scopes
  `tasks.readonly` + `drive.readonly`, resilient `syncGoogleIntoState` (per-source
  `allSettled`, per-source `SyncOutcome` reported by `POST /api/sync`).
- **Logo assets**: `public/logo.png` + `src/app/icon.png` (favicon), `LogoMark` component
  used in sidebar, mobile bar, landing header, auth and the `/app` fallback; old
  `favicon.ico` removed.
- Dashboard "Connect Google" / "Disconnect" controls (Today page; `googleConnected`
  flows from `app/app/layout.tsx`).

### Changed
- **Theme flipped dark-first** (tokens renamed nothing, values changed in `globals.css`
  `@theme`): bg `#0b0d16`, panel `#131626`, indigo `#5d60ee`, dark shadows,
  `color-scheme: dark`, dark `::selection` and glass surfaces. Whole app follows.
- Contrast fixes from the flip (see `docs/ACCESSIBILITY.md`): `ink-faint` → #838aad;
  selected chips moved `bg-indigo-soft` → new `indigo-tint` #23264a (light-on-light
  otherwise); `critical` → #dc2626 with new `critical-deep` #b91c1c destructive hover
  (white text on the delete button was 3.76).
- `DESIGN.md` and `docs/ACCESSIBILITY.md` updated to the dark palette.

### Removed
- **All mock dashboard data.** `src/lib/data.ts` deleted; store/db defaults are empty;
  chief chat seeds only its `WELCOME_MESSAGE` and takes `checkins` in `ChiefContext`
  (rules + LLM paths); dashboard empty states are real. `atlas.db` user state wiped.

## 0.3.0 — Trust & compliance pass (October 2026)

Legal transparency, privacy controls, ethical UX and accessibility work per the compliance
requirement list. Honest-state rule in effect: legal pages ship with clearly marked
placeholders, not invented business details, and `docs/LEGAL_COMPLIANCE.md` is the single
status sheet for all 20 requirements.

### Added
- **Account deletion, end to end.** Settings page (`/app/settings`) with a danger-zone dialog
  spelling out every consequence; deletion requires the current password (reauthentication)
  plus an explicit acknowledgment. Server route `POST /api/account/delete` is rate limited
  (separate buckets from login) and removes sessions, dashboard state, Google tokens and the
  user row in one SQLite transaction — every session on every device dies instantly.
- **Settings page** (`/app/settings`): account summary, Google connection status with
  token-disconnect, danger zone. New `Sliders` nav entry in the shell.
- **Legal pages** (all prerendered, linked from landing footer): `/legal` (mentions légales
  with placeholders), `/privacy` (real data processing described: categories, purposes, legal
  bases, retention, recipients, AI providers, transfers, rights), `/terms` (CGU style, CGV
  marked not applicable), `/cookies` (exact cookie inventory).
- **Compliance documentation**: `docs/LEGAL_COMPLIANCE.md` (20-requirement status sheet + open
  legal questions), `docs/PRIVACY_DATA_MAP.md` (field-level inventory), `docs/THIRD_PARTY_SERVICES.md`
  (active vs dormant integrations), `docs/ASSET_LICENSES.md` (Geist/JetBrains Mono OFL, Phosphor
  MIT, logo), `docs/ACCESSIBILITY.md`.
- **Tests** (`npm run test`): node:test suite covering account deletion — full record removal,
  session revocation, other-user isolation, idempotent repeat deletion.
- Skip-to-content links (landing, dashboard, legal pages) and a Settings nav entry.

### Changed
- Signup form now discloses data collection purpose next to the submit button and links terms,
  privacy and cookie policy. States the 16+ age guideline. No marketing consent exists, so none
  is simulated.
- Theme token `--color-ink-faint` darkened #5c5b85 → #54537b: worst measured text ratio vs
  `indigo-soft` backgrounds went from 4.28:1 to 4.85:1 (now AA everywhere).
- Notification bell accessible name announces the unread count ("Notifications, N unread")
  instead of relying on the color dot alone.
- `README`, `ARCHITECTURE`, `SECURITY` updated to match (settings route, deletion flow, routes
  table, limitations table additions).

### Not applicable (documented in `docs/LEGAL_COMPLIANCE.md`)
- Cookie consent banner: zero optional storage exists to consent to; banner precondition set.
- CGV, withdrawal rights, hidden fees: no paid plans and no billing code anywhere.
- Unsubscribe link: no marketing email is sent; no fake footer either.
