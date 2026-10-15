import type { Metadata } from "next";
import { LegalShell, Ph } from "@/components/legal";

export const metadata: Metadata = {
  title: "Atlas — legal notice",
  description: "Legal notice for the Atlas service: publisher, host and responsibilities.",
};

export default function LegalPage() {
  return (
    <LegalShell
      title="Legal notice"
      subtitle="Mentions légales"
      updated="October 2026 (draft — placeholders pending operator confirmation)"
    >
      <p>
        This page identifies the publisher and host of the Atlas service. Fields marked
        <Ph /> are unconfirmed and must be completed by the operator before any legally
        binding publication. No business detail on this page is invented.
      </p>

      <h2>Publisher (éditeur)</h2>
      <ul>
        <li>
          <strong>Operator / publisher:</strong> <Ph>[legal name of publisher — natural person or company]</Ph>
        </li>
        <li>
          <strong>Legal form and registration:</strong> <Ph>[legal form, registration number, RCM or equivalent]</Ph>
        </li>
        <li>
          <strong>Registered or business address:</strong> <Ph>[address]</Ph>
        </li>
        <li>
          <strong>Contact:</strong> <Ph>[email address]</Ph> · <Ph>[other contact channel, if any]</Ph>
        </li>
        <li>
          <strong>Publication director (directeur de la publication):</strong> <Ph>[name of the person legally responsible for publication]</Ph>
        </li>
        <li>
          <strong>VAT or tax identification number, where applicable:</strong> <Ph>[tax ID or &quot;not yet registered&quot;]</Ph>
        </li>
      </ul>

      <h2>Hosting (hébergeur)</h2>
      <p>
        The hosting provider is currently <Ph>[hosting provider — to be confirmed by the operator]</Ph>.
        Until a production deployment is chosen, Atlas runs on developer infrastructure and
        this section cannot be completed truthfully.
      </p>
      <ul>
        <li>
          <strong>Provider:</strong> <Ph>[provider legal name]</Ph>
        </li>
        <li>
          <strong>Address:</strong> <Ph>[provider address]</Ph>
        </li>
        <li>
          <strong>Contact:</strong> <Ph>[provider contact details, including abuse contact]</Ph>
        </li>
      </ul>

      <h2>Publication responsibility</h2>
      <p>
        Content published in the product interface and its documentation is published under
        the responsibility of the publisher identified above. Questions about specific
        content should be sent to the publisher contact.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Atlas name, the logo mark and the visual system of the interface belong to{" "}
        <Ph>[rights holder]</Ph>. The Atlas source code is published as open source under the
        MIT license (see the LICENSE file in the code repository), except where third-party
        components carry their own licenses; these are inventoried in{" "}
        <Ph>[Asset licenses record — see the repository’s “docs/ASSET_LICENSES.md”]</Ph>.
        Third-party marks named in the interface or documentation (Google, Gmail, Gemini,
        OpenAI, Anthropic and others) belong to their respective owners.
      </p>

      <h2>Status of this page</h2>
      <p>
        A legal notice is only complete once the operator has confirmed the sections above.
        This page deliberately ships with placeholders rather than assumed details. Nothing
        here should be read as a claim that Atlas has completed any registration, license or
        compliance process.
      </p>
    </LegalShell>
  );
}
