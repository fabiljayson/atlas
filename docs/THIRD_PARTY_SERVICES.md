# Third-party services

Inventory of every external integration Atlas can reach, with the data each one sees.
Rule used here: **an integration is listed as "active" only when it is configured and
reachable in the running deployment**, not merely because code supports it.

## Actually active (verify per deployment)

### Google Gemini (AI chief of staff)

| Field | Value |
|---|---|
| Purpose | Chief-of-staff chat replies (`POST /api/chief`) |
| Used when | `GEMINI_API_KEY` is set in the server environment (it is, in the developer's `.env.local`) |
| Data shared | User's message plus a truncated working set: up to 20 tasks, 8 objectives, 30 file summaries (first 160 chars each), 3 recent check-ins |
| Keys | `GEMINI_API_KEY`, optional `GEMINI_MODEL` (default `gemini-3.1-flash-lite`). Server-side only; sent as an `x-goog-api-key` header, never in URLs or client code |
| Retention (Atlas side) | Chat history is stored in the user's own dashboard data until account deletion. Provider-side retention is governed by [Google's terms](https://ai.google.dev/gemini-api/terms) **— to be verified and updated by the operator** |
| Failure behavior | Any error falls through to the next configured provider, then to the local rules engine. The user never sees an error page and no key or secret is included in any response |
| Docs | [generativelanguage.googleapis.com docs](https://ai.google.dev/gemini-api/docs) |

### Google (OAuth: Gmail, Calendar, Tasks, Drive)

| Field | Value |
|---|---|
| Purpose | Optional read-only sync of mail, events, tasks and Drive files into the dashboard |
| Used when | `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` are configured **and** the user completes the connect flow. If neither is configured, none of the Google code paths runs |
| Scopes | `gmail.readonly`, `calendar.readonly`, `tasks.readonly`, `drive.readonly` (read-only by design) |
| Data shared with Google | Nothing except the API requests themselves; Atlas pulls data from Google, it does not push |
| Data stored by Atlas | `google_tokens` table: access token, refresh token, expiry, scope — server-side only |
| Disconnect | `DELETE /api/google/disconnect` removes the stored tokens (see Settings). Removing access in Google's own account settings is a separate action the user takes with Google |
| Settings | `GOOGLE_REDIRECT_URI` must match the console registration |
| Docs | [developers.google.com/oauthplayground reference](https://developers.google.com/identity/protocols/oauth2) |

## Supported but inactive unless configured

### OpenAI (AI chief of staff)

Same role as Gemini. Active only if `OPENAI_API_KEY` is set in the server environment.
Tried in order OpenAI → Anthropic → Gemini; same failure fallback rules.

### Anthropic (AI chief of staff)

Same role, active only if `ANTHROPIC_API_KEY` is set. Same rules as above.

## Not present

| Category | Status |
|---|---|
| Email sending (marketing or transactional) | Not implemented. No unsubscribe is shown and none is faked; see roadmap in `docs/LEGAL_COMPLIANCE.md` |
| Analytics / error reporting / monitoring | None. No third-party scripts, pixels, SDKs or telemetry are loaded by the client |
| Advertising / retargeting | None |
| External fonts, CDNs, embedded content | None. Fonts (Geist, JetBrains Mono) are self-hosted in `public/fonts`; all assets are first-party |
| Payment providers | None; no paid plans exist |

## Risks and open items

| Risk | Mitigation today | Follow-up |
|---|---|---|
| A prompt may contain sensitive personal data from the user's dashboard | The user controls every message; context is truncated; provider keys are server-side | Operator should record the provider's zero-retention / no-training option for API traffic and switch it on if available |
| Provider outages are user-invisible by design (silent fallback) | Chat always answers; engine used is reported in the API response (`engine: "llm"` or `"rules"`) | Consider surfacing the active engine in the UI truthfully |
| Rate-limit state sits in one process | Acceptable for single-instance deploys | Move to a shared store before multi-instance |
| AI messages shipped to a provider cannot be recalled by account deletion | Disclosed in the privacy policy and the deletion dialog | Nothing further can be done client-side |
