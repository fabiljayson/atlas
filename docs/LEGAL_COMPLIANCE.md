# Legal compliance checklist

Status of each requirement as of October 2026. Statuses are honest about what is code and
what is paper: "implemented" only means the code or content landed and was verified by
the listed check. **Nothing here asserts Atlas is legally compliant**; binding statements
do not exist until the operator's identity, hosting and jurisdictions are confirmed in the
placeholder fields of `/legal` and `/privacy` and reviewed by a qualified professional.

Decision record (operator choices, October 2026):
Legal pages ship with clearly-marked placeholders · Atlas is stated as 16+ ·
Supervisory authority stays generic until establishment is known · no paid plans → no CGV,
no withdrawal flow, no unsubscribe UI, no consent banner.

## Requirement statuses

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | Mentions légales / legal notice | **Implemented but not fully tested; requires business information** | `/legal` page ships with placeholders for publisher, registration, host and publication director; landing page links it. Cannot be complete until operator fills the fields |
| 2 | Confidentialité (RGPD) / privacy policy | **Implemented but requires legal review** | `/privacy` documents actual behavior (tables in docs/PRIVACY_DATA_MAP.md): categories, purposes, legal bases, retention, recipients, AI providers, transfers, rights, cookies |
| 3 | CGV / CGU terms | **Partially implemented; CGV not applicable today** | `/terms` covers use (roles, acceptable use, no-promise disclaimers, suspension, IP, governing-law placeholder); CGV section explicitly states there are no paid offers |
| 4 | Droit de rétractation | **Not applicable — justified** | No paid plans, no checkout, no subscription code exists anywhere; documented in `/terms` CGV section. Revisit before any billing ships |
| 5 | Politique cookies | **Implemented and verified** | `/cookies` inventories the single cookie (`atlas_session`, strictly necessary) and states what is absent (verified: no analytics, ads, embeds, localStorage) |
| 6 | Bandeau cookies | **Not applicable — justified** | No optional storage exists to consent to; a banner would be a consent theater. Precondition to add one is set in `/cookies` — banner ships together with the first optional category |
| 7 | Consentement formulaires | **Implemented** | Signup form: purpose notice next to submit, only necessary fields (name/email/password), terms + privacy + cookies links, no marketing checkbox at all; Google connect uses consent-scoped OAuth; no other collection forms exist |
| 8 | Zéro donnée inutile | **Implemented (audit-done) with limits** | Full field map in docs/PRIVACY_DATA_MAP.md; password stored as scrypt hash only; session tokens stored hashed; IPs only in transient memory; nothing removed because nothing unnecessary is collected. Google tokens deletable at Settings |
| 9 | Audit des outils tiers | **Implemented** | docs/THIRD_PARTY_SERVICES.md: active vs supported-but-inactive split, data flows, failure behavior, keys server-side, gaps to verify |
| 10 | Zéro dark pattern | **Implemented (audit-clean)** | No paid flows exist (nothing to hide); no timers, scarcity, countdowns or marketing consent anywhere; sign-out, Google disconnect and account deletion are all visible, one to three clicks deep, non-obscured |
| 11 | Zéro frais cachés | **Not applicable — justified** | No billing exists; `/terms` forbids showing prices as offers until a real checkout ships |
| 12 | Zéro faux avis | **Implemented — clean by omission** | No testimonials, user counts, ratings, endorsements or customer logos exist in any page; landing shows real product mockups only |
| 13 | Zéro promesse non prouvée | **Implemented** | Copy audited: no "secure/100%/guaranteed" claims; `/terms` states availability, AI reliability, urgency classification and backup limits in plain language; metadata description is factual |
| 14 | Texte alt des images | **Implemented and verified** | Only raster assets are the logo derivatives; `LogoMark` uses `alt=""` always (decorative, paired with text/label). No informative images exist |
| 15 | Contraste des couleurs | **Implemented and tested (computed)** | docs/ACCESSIBILITY.md table; `ink-faint` darkened to #54537b; all measured pairs ≥ 4.5:1 text / ≥ 3:1 UI; urgency labels are text, not color-only |
| 16 | Navigation au clavier | **Implemented (code-review walkthrough)** | Skip links on landing/dashboard/legal; modal focus trap + restore; popover Escape/`aria-*`; labeled forms; no keyboard traps found |
| 17 | Accord parental (mineurs) | **Implemented (16+ notice) — open verification question** | 16+ stated in `/terms`, `/privacy`, signup note, settings; no verification mechanism (proportionate, documented); procedure for discovered under-16 accounts is an operator TODO |
| 18 | Lien de désinscription | **Not applicable — justified** | No marketing email is sent (no mailer code exists); faking an unsubscribe would be dishonest. Requirement recorded for when email lands, incl. suppression-list needs, in the roadmap below |
| 19 | Licences polices/images | **Implemented — one verification action open** | docs/ASSET_LICENSES.md: Geist + JetBrains Mono (OFL 1.1), Phosphor (MIT), logo project-owned, create-next-app SVGs flagged as removable. OFL notice files must be shipped next to fonts before publishing (checklist in the doc) |
| 20 | Suppression des données | **Implemented and tested** | `POST /api/account/delete` (password reauth + rate limiting) → `deleteUserAccount` transaction removing sessions, user_state, google_tokens, users; delete dialog lists consequences + irreversibility; Settings UI ships it; 3 node:test suites pass; limits (AI provider copies, backups) disclosed in `/privacy` and the dialog |

## Implementation notes that reviewers should know

- **Rate limiting on deletion reauth** uses separate buckets (`delete:email:*` /
  `delete:ip:*`) so an attacker cannot lock a victim's login or vice versa.
- **Session revocation after deletion works for every device**: sessions are validated
  per request against the DB; deleting the user's rows kills all of them, and the proxy
  rejects cookie presence alone anyway.
- **No data is silently deleted anywhere** except through the explicit user-initiated
  flow (and lazy cleanup of expired session rows).
- The `/cookies` "why no banner" section states its condition for becoming untrue; if a
  tracker ships before a banner does, that is a defect of the new integration, not of
  this page.

## Outstanding legal questions (need a qualified professional)

1. Jurisdiction bundle: operator establishment, governing law for `/terms`, competent
   supervisory authority for `/privacy`, and whether the French mentions légales regime
   applies as drafted.
2. Whether the AI provider processing needs its own consent or only disclosure for the
   intended markets, and which provider terms apply to operator-paid API traffic
   (training/retention opts-out).
3. Whether the 16+ policy plus the absence of age verification is defensible for the
   chosen markets (some jurisdictions have different thresholds).
4. Password-hash and DB-file best practice review of the self-hosting posture: the
   database is a single local file; an operator running this in production needs a
   backup policy and ideally server-side encryption before the privacy policy's
   retention table is complete.
5. Any consumer-protection framing for the free service in target markets (for example,
   whether the no-SLA / as-is wording is enforceable against consumers).

## Business information still needed

| Item | Where it blocks |
|---|---|
| Publisher identity, address, registration, contacts | `/legal`, `/privacy` controller |
| Hosting provider legal name + contacts | `/legal` host section |
| Production domain and deployment choice | `/legal`, security posture in `docs/SECURITY.md` |
| Operator contact for data-subject requests and exports | `/privacy` rights section |
| Supervisory authority (once establishment is fixed) | `/privacy` complaints section |
| Export tooling decision (or manual format) | `/privacy` access/portability row |
| Under-16 handling procedure owner | `/terms` minors note |

## Roadmap hooks (when features change, revisit)

- Email is added → build the double-track: marketing consent (separate, unchecked,
  unsubscribable one-click without login) vs transactional mail, plus a suppression list.
- Payment is added → full CGV page, withdrawal flow with its per-jurisdiction analysis,
  no-dark-pattern checkout, and the fee-transparency checklist from the requirement list.
- Analytics is added → the `/cookies` banner condition and its "equal option" design
  become mandatory at the same commit.
