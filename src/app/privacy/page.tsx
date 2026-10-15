import type { Metadata } from "next";
import { LegalShell, Ph } from "@/components/legal";

export const metadata: Metadata = {
  title: "Atlas — privacy policy",
  description: "What Atlas collects, why, for how long, who processes it, and your rights.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy policy"
      subtitle="Confidentialité"
      updated="October 2026 (describes current behavior; operator fields are placeholders)"
    >
      <p>
        This policy describes what <strong>Atlas</strong> actually does with personal data
        today — not what it may do later. It is written for Atlas&apos;s current stage: a
        self-hostable dashboard with email/password accounts, per-user data storage, an
        optional AI assistant and optional Google connections. Fields marked
        <Ph /> need operator confirmation (see the{" "}
        <a href="/legal">legal notice</a>).
      </p>

      <h2>Who is responsible</h2>
      <p>
        The controller is the Atlas operator: <Ph>[operator identity from the legal notice]</Ph>.
        Once an operator is established in an applicable jurisdiction, the competent
        supervisory authority for complaints will be identified here:{" "}
        <Ph>[supervisory authority — withheld until the country of establishment is confirmed]</Ph>.
      </p>

      <h2>What Atlas collects and why</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Purpose</th>
            <th>Legal basis</th>
            <th>Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name, email address</td>
            <td>Account identity, login</td>
            <td>Contract performance (providing the account you asked for)</td>
            <td>Until you delete your account</td>
          </tr>
          <tr>
            <td>Password hash and salt (scrypt)</td>
            <td>Authentication; the password itself is never stored or sent anywhere</td>
            <td>Contract performance; legitimate interest (account security)</td>
            <td>Until account deletion</td>
          </tr>
          <tr>
            <td>Session cookie and its server-side hash</td>
            <td>Keeping you signed in; the cookie cannot be replayed from a stolen database</td>
            <td>Strictly necessary (session), stored in hashed form</td>
            <td>30 days, or until you sign out or delete your account</td>
          </tr>
          <tr>
            <td>Dashboard content: tasks, objectives, files metadata and summaries, mail/calendar snapshots, check-ins, chat history, drafted content</td>
            <td>Working product features and persistence across devices</td>
            <td>Contract performance</td>
            <td>Until you delete your account or remove the items in the product</td>
          </tr>
          <tr>
            <td>Google OAuth tokens (Gmail, Calendar, Tasks, Drive — read-only scopes), only if you connect Google</td>
            <td>Fetching your data at your request; tokens are kept server-side</td>
            <td>Your consent, given separately in the Google connection flow and revocable there or here</td>
            <td>Until you disconnect Google or delete your account</td>
          </tr>
          <tr>
            <td>IP address (transient, in memory only)</td>
            <td>Login and signup rate limiting to protect accounts</td>
            <td>Legitimate interest (security against abuse)</td>
            <td>Minutes to hours, never written to the database</td>
          </tr>
          <tr>
            <td>AI assistant messages and the context attached to them</td>
            <td>Answering your request; see &quot;AI providers&quot; below</td>
            <td>Contract performance (the assistant you ask) — you control every message you send</td>
            <td>Stored in your dashboard history until account deletion; provider-side handling below</td>
          </tr>
        </tbody>
      </table>

      <h2>What Atlas does not collect</h2>
      <ul>
        <li>No analytics, advertising or social embeds, and no third-party cookies.</li>
        <li>No marketing emails; there is no mailing list.</li>
        <li>No payment details; there are no paid plans.</li>
        <li>No sensitive data is requested anywhere, and you should not put sensitive
        information into task titles, files or chat messages you do not need there.</li>
      </ul>

      <h2>Recipients and processors</h2>
      <ul>
        <li>
          <strong>Hosting:</strong> <Ph>[hosting provider — to be confirmed]</Ph> stores the
          application and its database file (SQLite).
        </li>
        <li>
          <strong>AI providers:</strong> see the next section.
        </li>
        <li>
          <strong>Google:</strong> reads the Gmail/Calendar/Tasks/Drive data you connect;
          see <a href="https://policies.google.com/privacy">Google&apos;s privacy policy</a>.
        </li>
        <li>
          Atlas does not sell personal data and does not use it for advertising.
        </li>
      </ul>

      <h2>AI providers (chief of staff)</h2>
      <p>
        When configured by the operator, the AI assistant sends a request to{" "}
        <Ph>[active provider — currently Google Gemini when the GEMINI_API_KEY key is present; OpenAI and Anthropic are supported]</Ph>.
        The request contains your message plus a truncated working set of your tasks,
        objectives, file summaries, and recent check-ins, because the assistant answers from
        them. Provider failures fall back to the next configured provider, and then to a
        built-in rule engine that runs entirely on the server with no provider involved.
      </p>
      <ul>
        <li>
          Operator-configured API keys stay server-side; they are never sent to the browser.
        </li>
        <li>
          How long a provider keeps prompt data and whether Microsoft, Google or Anthropic
          use it for training is governed by that provider&apos;s terms; operator should verify
          and record the current provider-subscriber terms in
          <Ph>[docs/THIRD_PARTY_SERVICES.md]</Ph>. Atlas does not delete or claim to delete
          provider-side copies after account deletion.
        </li>
        <li>
          You can avoid external processing entirely by not using the assistant, or by
          asking the operator to remove AI keys from the deployment; Atlas then answers
          with the built-in rules engine only.
        </li>
      </ul>

      <h2>International transfers</h2>
      <p>
        Where AI or hosting providers process data outside the region where this deployment
        runs, transfers follow that provider&apos;s safeguards (for example standard contractual
        clauses, if the provider publishes them). The operator should confirm transfer
        details for the chosen providers here: <Ph>[transfer analysis pending provider and hosting confirmation]</Ph>.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights of access, rectification,
        erasure, restriction, portability and objection, and the right to withdraw consent
        (for example for the Google connection).
      </p>
      <ul>
        <li>
          <strong>Erasure:</strong> self-service at <a href="/app/settings">Account settings</a>,
          which permanently deletes your account, dashboard content, Google tokens and all
          sessions without contacting anyone.
        </li>
        <li>
          <strong>Access and portability:</strong> <Ph>[operator contact — data export tooling not yet shipped]</Ph>.
        </li>
        <li>
          <strong>Other requests:</strong> contact <Ph>[operator contact email]</Ph>.
        </li>
      </ul>
      <p>
        Note the current limits: Atlas cannot promise deletion of copies already sent to an
        AI provider, and the operator-sized backups of the SQLite file (if any) are the
        operator&apos;s responsibility: <Ph>[backup policy to be documented by the operator]</Ph>.
      </p>

      <h2>Cookies</h2>
      <p>
        Atlas sets a single first-party cookie, <code>atlas_session</code>, which is the
        login session cookie (strictly necessary). Full inventory:{" "}
        <a href="/cookies">cookie policy</a>.
      </p>

      <h2>Children</h2>
      <p>
        Atlas is intended for people aged <strong>16 and over</strong>. Accounts known to
        belong to under-16s will be handled per the terms of use. No age verification is
        performed today; this is documented as an open compliance question in{" "}
        <Ph>[repository docs/LEGAL_COMPLIANCE.md]</Ph>.
      </p>

      <h2>Changes</h2>
      <p>
        This policy will be revised when behavior changes (for example when hosting,
        payments, analytics or email sending appear). The review date at the top will move.
      </p>
    </LegalShell>
  );
}
