import type { Metadata } from "next";
import { LegalShell } from "@/components/legal";

export const metadata: Metadata = {
  title: "Atlas — cookie policy",
  description: "The complete cookie and storage inventory for Atlas.",
};

export default function CookiesPage() {
  return (
    <LegalShell
      title="Cookie policy"
      subtitle="Cookies"
      updated="October 2026 (verified against the running application)"
    >
      <p>
        This is the complete inventory of cookies and browser storage used by Atlas,
        verified against the running application. There is one cookie, and it is strictly
        necessary.
      </p>

      <h2>Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>atlas_session</code></td>
            <td>Atlas (first party)</td>
            <td>Keeps you signed in between requests. Contains a random token; the server stores only its SHA-256 hash. HttpOnly, SameSite=Lax, Secure in production.</td>
            <td>30 days, or until you sign out or delete your account</td>
            <td>Strictly necessary (no consent required)</td>
          </tr>
        </tbody>
      </table>

      <h2>What Atlas does not use</h2>
      <ul>
        <li>No analytics or measurement cookies, and no analytics scripts.</li>
        <li>No advertising, retargeting or social media cookies or pixels.</li>
        <li>No third-party embeds (the page loads no external scripts or frames).</li>
        <li>No <code>localStorage</code> or <code>sessionStorage</code> for personal data; dashboard state is server-side per account.</li>
        <li>No font or CDN cookies: fonts are self-hosted in the application.</li>
      </ul>

      <h2>Why there is no consent banner</h2>
      <p>
        Consent banners exist for optional storage and tracking. Atlas has none of these:
        the session cookie falls in the strictly-necessary category that does not require
        prior consent. If optional categories are ever added (analytics, error reporting,
        embedded content), a consent banner will be added at the same time, before those
        technologies are enabled, with equal accept/reject/customize options and a way to
        reopen it. This is recorded in the compliance checklist
        (docs/LEGAL_COMPLIANCE.md in the repository).
      </p>

      <h2>Related pages</h2>
      <p>
        See the <a href="/privacy">privacy policy</a> for the wider data inventory and the{" "}
        <a href="/terms">terms of use</a> for service rules.
      </p>
    </LegalShell>
  );
}
