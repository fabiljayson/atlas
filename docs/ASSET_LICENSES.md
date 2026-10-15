# Asset licenses

Licensing record for every visual and type asset shipped in `public/`. Each entry states
the source, the license, and what that license requires before redistribution. Verify the
license text before adding or replacing assets here.

## Fonts

### Geist (Sans)

| Field | Value |
|---|---|
| Files | `public/fonts/geist-latin.woff2` |
| Source | Vercel's Geist typeface family ([github.com/vercel/geist-font](https://github.com/vercel/geist-font)) |
| License | **SIL Open Font License 1.1** |
| Attribution required | Keep the OFL copyright and license notice with the font files (the OFL text must ship alongside); no formal credit line in the UI needed |
| Redistribution allowed | Yes, including bundled in web apps and in the MIT-licensed repo, provided the OFL notice travels with the file(s) |
| Note | Confirm the shipped woff2 was produced from an OFL-licensed build (the family is OFL; per-weight and variable variants differ). Preserve the original OFL.txt next to the font or link it from this file |

### JetBrains Mono

| Field | Value |
|---|---|
| Files | `public/fonts/jetbrains-mono-latin.woff2` |
| Source | JetBrains ([github.com/JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono)) |
| License | **SIL Open Font License 1.1** |
| Attribution required | OFL notice file must remain with the font |
| Redistribution allowed | Yes, same conditions as above |
| Note | JetBrains Mono also includes a JetBrains-specific "bundled with products" clause; OFL is the safe standing for redistribution in OSS projects |

## Icons

### Phosphor Icons (`@phosphor-icons/react`)

| Field | Value |
|---|---|
| Source | [phosphoricons.com](https://phosphoricons.com) via npm `@phosphor-icons/react` |
| License | **MIT** |
| Attribution required | None (MIT permits use without visible credit); license text retained in `node_modules` and via the npm dependency declaration |
| Redistribution | Icon paths ship as compiled code through the npm dependency, not as copied assets |

## Images

### Atlas logo mark (`public/logo.png`, plus `src/app/icon.png`/`favicon.ico` derivatives)

| Field | Value |
|---|---|
| Source | Project-owned artwork (designed for Atlas) |
| License | Same as the project (MIT) unless the operator adds a trademark registration later |
| Attribution | Not required; used as decoration (`alt=""`) next to the "Atlas" wordmark |

### Next.js template SVGs (`public/next.svg`, `public/vercel.svg`, etc.)

| Field | Value |
|---|---|
| Files | `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` |
| Source | `create-next-app` starter assets |
| License | Belong to Vercel/Next.js; **not used anywhere in the UI** |
| Action | Safe to delete from a production build; they are inert. Track removal before publishing |

## Landing-page mock imagery

The landing page contains no photographs, illustrations or third-party images: all
"previews" are hand-built UI mockups composed with the system's own components, so no
image licensing applies there.

### Hero background (`public/hero-background.png`, source copy at the repository root as "Background image.png")

| Field | Value |
|---|---|
| Source | Provided by the project owner (October 2026); provenance and creation details not recorded |
| License | Owner-supplied asset; confirm rights before any redistribution beyond the project's own builds |
| Attribution | Not required; shipped purely decorative (`alt=""`, `aria-hidden`) as a site-wide backdrop rendered once in `src/app/layout.tsx` |
| Note | Kept as the original PNG (1.7 MB, 1536×1024) at the owner's request; if page-weight budgets tighten, a compressed derivative should replace it and supersede this row |

## Verification checklist before publishing

1. Place the OFL license text for both fonts alongside `public/fonts/` (or link to it here).
2. Do not swap a font file for a variant with a different license without updating this file first.
3. Keep this table current when adding any new asset, icon set, illustration or photograph.
