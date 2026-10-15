# Accessibility

Audit findings and results, October 2026. Target: WCAG 2.2 AA where practical, keeping
Atlas's light indigo system. Method used here is code review plus computed contrast
ratios and scripted checks — **not** an automated axe/Lighthouse run or a screen-reader
session; that is listed as follow-up work below.

## Contrast (computed)

Measured with the WCAG relative-luminance formula against every surface the theme composes.

| Foreground | Background | Ratio | Result |
|---|---|---|---|
| `ink` #1e1b4b | `bg` #eef2ff | 14.3 | Pass AA (any size) |
| `ink-dim` #4c4a73 | `bg` #eef2ff | 7.4 | Pass |
| `ink-faint` #5c5b85 | `bg` #eef2ff | 5.7 | Pass, but… |
| `ink-faint` #5c5b85 | `indigo-soft` #c7d2fe | 4.28 | Fail (fixed below) |
| `ink-faint` (new) #54537b | every surface incl. `indigo-soft` | 4.85–7.2 | Pass everywhere |
| white on `indigo` #4f46e5 | buttons, primary CTAs | 6.3 | Pass |
| white on `critical` #dc2626 | destructive delete button | 4.8 | Pass |
| `critical-ink` #b91c1c | `critical/10` on bg | 5.8 | Pass |
| `urgent-ink` #92400e | badges on bg | 6.3 | Pass |
| focus outline `indigo` on `bg` | outline color | 5.6 | Pass (3:1 required) |

**Change made:** `--color-ink-faint` darkened #5c5b85 → #54537b (worst case 5.7 → 6.5 on
`bg`; the failing `indigo-soft` surface goes 4.28 → 4.85). Still lighter than `ink-dim`,
so the hierarchy survives.

Urgency levels are never color-only: `UrgencyBadge` always carries its level as text
(critical / high / normal / low) plus a dot, so the same information is available
without color.

## Keyboard (code review + manual walk-through)

- **Global focus style** (`:focus-visible` = 2px indigo outline, offset 2px) applies to every control.
- **Modal** (`ui.tsx`): focus moves to the dialog on open, Tab is trapped inside it, Escape closes and restores focus to the trigger on close. Dialog has `role="dialog"`, `aria-modal`, and an accessible title.
- **Bell popover**: opens on click with `aria-expanded`/`aria-controls`, receives focus when opened, Escape closes and refocuses the bell button; outside-click closes it.
- **Skip link** added to the dashboard shell, the landing page and the legal pages ("Skip to content", visible on focus, targets the `<main>`).
- Walk-through performed by code reading (no automated run): signup → login → settings → consent-relevant controls → delete-account dialog are all reachable by Tab in DOM order and operable with Enter/Space/Escape only.

## Alt text and non-visual cues

- `LogoMark` renders `alt=""` (decorative) everywhere; it is always paired with the visible "Atlas" text or an `aria-label="Atlas home"` link, so no information is image-borne.
- The unread notification indicator is now announced in the bell's accessible name ("Notifications, N unread") instead of being a bare color dot.
- The landing page's "previews" are honest, labeled UI mockups built from real components, not images; screen readers will read their text, which matches what sighted users see.

## Forms

- Labels sit above inputs (`Field` component wraps label + control); every input in login, signup and the settings dialogs is labeled.
- Errors render as bordered text blocks below the offending field group (`AuthError`; the delete dialog shows its error inside the dialog).
- Signup carries honest collection notices next to the submit button (what will be stored, terms/privacy/cookie links, 16+ note) with no prechecked boxes of any kind.

## Known limits and follow-ups

| Item | Status |
|---|---|
| Automated audit (axe-core / Lighthouse) not yet run | Follow-up: run against key routes and attach results here |
| Screen-reader pass (NVDA/voiceover) not yet performed | Follow-up |
| Live contrast check of `glass`-over-gradient surfaces (translucent bars over the body gradient) | The measured background sits within the tolerance range of the tokens tested; re-measure if the body gradient changes |
| `Window` shims for focus behavior are manual rather than a headless dialog library | Acceptable first-class implementation; revisit if more dialogs appear |
| Age verification (16+) | No mechanism, by design; see LEGAL_COMPLIANCE.md |
