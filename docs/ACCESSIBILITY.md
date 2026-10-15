# Accessibility

Audit findings and results, October 2026. Target: WCAG 2.2 AA where practical, keeping
Atlas's dark indigo system. Method used here is code review plus computed contrast
ratios and scripted checks — **not** an automated axe/Lighthouse run or a screen-reader
session; that is listed as follow-up work below.

## Contrast (computed)

Measured with the WCAG relative-luminance formula against every surface the theme composes
(`bg` #0b0d16, `panel` #131626, `panel-2` #1a1e31).

| Foreground | Background | Ratio | Result |
|---|---|---|---|
| `ink` #edf0fb | `bg` #0b0d16 | 17.0 | Pass AA (any size) |
| `ink-dim` #aab0cc | `bg` / `panel` | 9.0 / 8.4 | Pass |
| `ink-faint` #838aad | `bg` / `panel` / `panel-2` | 5.7 / 5.3 / 4.9 | Pass everywhere |
| white on `indigo` #5d60ee | buttons, primary CTAs, chat bubbles | 4.80 | Pass |
| white on `critical` #dc2626 | destructive delete button | 4.83 | Pass |
| white on `critical-deep` #b91c1c | destructive button hover | 6.47 | Pass |
| `critical-ink` #fca5a5 | `critical/10` on panel | ~9.4 | Pass |
| `urgent-ink` #fcd34d | badges on bg / panel | 13.4 / 12.4 | Pass |
| `good-ink` #86efac | badges on bg / panel | 13.8 / 12.8 | Pass |
| `ink` / `ink-dim` on `indigo-tint` #23264a | selected nav, tabs, file rows | 12.8 / 6.8 | Pass |
| focus outline `indigo` #5d60ee on `bg` / `panel` | outline color | 4.0 / 3.7 | Pass (3:1 required) |

**Change made during the dark redesign:** three pairings inherited from the light theme
failed on dark and were fixed:

1. `ink-faint` was #7d84a6 (4.49 on `panel-2`, just under 4.5) → lightened to #838aad.
2. Selected chips used `bg-indigo-soft` with `text-ink` (1.88, light-on-light) → chips now
   use the new `indigo-tint` #23264a surface; `indigo-soft` #a9abf6 stays an accent-text
   token only and is never a background under light text.
3. `critical` became #dc2626 so white button text passes (the previous #ef4444 was 3.76);
   the destructive button's hover moved to the new `critical-deep` #b91c1c (#fca5a5 would
   have failed under white text).

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
