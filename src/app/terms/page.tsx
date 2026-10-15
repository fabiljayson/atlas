import type { Metadata } from "next";
import { LegalShell, Ph } from "@/components/legal";

export const metadata: Metadata = {
  title: "Atlas — terms of use",
  description: "The rules for using Atlas: responsibilities, acceptable use, availability and limits.",
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of use"
      subtitle="CGU"
      updated="October 2026 (draft — operator and jurisdiction fields are placeholders)"
    >
      <p>
        These are the rules for your Atlas account. The consumer-subscription terms (CGV) are
        separate and at the bottom, because Atlas has no paid plans today. Fields marked
        <Ph /> are pending operator or legal confirmation.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>One account per person. You are responsible for your password and for the activity in your account.</li>
        <li>Give a real email you control; it is the only identity Atlas knows you by.</li>
        <li>Atlas is intended for people aged 16 and over.</li>
        <li>You can cancel at any time by signing out, and you can permanently delete your account and all its data yourself in <a href="/app/settings">Account settings</a>.</li>
      </ul>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use Atlas to break the law, to attack systems, or to automate abuse of the service.</li>
        <li>Do not attempt to access another user&apos;s data or probe for ways around the authentication.</li>
        <li>Do not overload the AI assistant or the sync endpoints with automated requests.</li>
        <li>Content you put into Atlas is yours; you remain responsible for what it contains.</li>
      </ul>

      <h2>What Atlas does not promise</h2>
      <ul>
        <li>
          <strong>Availability:</strong> the service is provided as is, without an uptime
          commitment or SLA. Atlas runs on <Ph>[hosting provider — to be confirmed]</Ph>, and
          outages are possible.
        </li>
        <li>
          <strong>AI answers:</strong> the AI assistant can be wrong, incomplete or miss the
          point. It works from your stored data and is not a legal, financial or medical
          advisor. Verify anything important before you rely on it. When no provider key
          works, the assistant falls back to fixed templates, and it will not tell you it is
          improvised in a separate way from its normal replies.
        </li>
        <li>
          <strong>Backups:</strong> no user-requested backups exist. Deleted data (including a
          deleted account) is gone for good at your end.
        </li>
        <li>
          <strong>Urgency classification:</strong> sorting of mail, tasks and events by
          urgency is automated and can misjudge a real-life priority.
        </li>
      </ul>

      <h2>Suspension and termination</h2>
      <p>
        The operator may suspend or terminate an account that breaks these terms,
        attacks the service, or creates risk for other users, with a proportionate notice
        where the situation allows: <Ph>[abuse process — to be defined by the operator]</Ph>.
        You may stop using Atlas at any time; account deletion is self-service and immediate.
      </p>

      <h2>Changes to the service and to these terms</h2>
      <p>
        Features change as the product develops. These terms are a draft until an operator
        publishes them in final form; material changes to binding terms will be communicated
        before they take effect: <Ph>[change-notice mechanism — to be defined, e.g. email or in-app notice]</Ph>.
      </p>

      <h2>Intellectual property</h2>
      <ul>
        <li>You keep the rights to your own content in Atlas.</li>
        <li>The Atlas software is open source under the MIT license; the interface, name and logo are the publisher&apos;s (see the <a href="/legal">legal notice</a>).</li>
        <li>You grant the service only what is technically needed to run: storage, processing for features you use, and sending your chosen assistant messages to a provider.</li>
      </ul>

      <h2>Governing law and disputes</h2>
      <p>
        The governing law and the forum for disputes depend on the operator&apos;s place of
        establishment and market, which are not yet fixed:
        <Ph>[governing law — pending legal review; do not publish until confirmed]</Ph>.
       Consumers keep any protection granted by the mandatory rules of their own country,
        regardless of the clause above.
      </p>

      <h2>Commercial terms (CGV)</h2>
      <p>
        <strong>Not applicable today.</strong> Atlas has no paid subscriptions, no prices and
        no billing integration. If paid plans are introduced, this section will state the
        full price and currency, billing frequency, treatment of taxes, renewal, trial and
        cancellation terms, and the withdrawal conditions — before any checkout is shown. No
        prices shown above this paragraph should be considered an offer.
      </p>
    </LegalShell>
  );
}
