# Legal page
Legal document template with the Compliance head, prose sections, footer and navigation.

Install: npx agentcard-ds add legal-page
Requires: theme, nav-dock, prose, site-footer, site-header
Packages: none
Exports: LegalPage
Client boundary: not required by this entry file
Reference: Not in the agentcard-website source yet; agentcard.sh /terms and /card-terms (computed: .v7-about-head, .v7-prose)


## Usage
Use as a starting point for Agentcard terms, privacy or card terms. Pass the title, the date and your own sections; the sample is not legal text.
- Avoid: A table of contents
- Avoid: Caps headings
- Avoid: Bold paragraphs
- Avoid: A second column beside the text


## Examples
Example components: npx agentcard-ds add legal-page
[Block](https://agentcard-ds.vercel.app/preview/legal-page/Block)

examples/legal-page.tsx

```tsx
import { LegalPage } from "@/components/blocks/legal-page";

export function Block() {
  return <LegalPage />;
}

```

## Source

components/blocks/legal-page.tsx

```tsx
import type { ReactNode } from "react";

import { NavDock } from "@/components/site/nav-dock";
import { Prose } from "@/components/site/prose";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

// The footer as agentcard.sh carries it on every page: five columns, the line, the running line. Sample categories
// stand in for the merchant names; replace them with your own.
const FOOTER = {
  description: (
    <>
      We want agents to buy anything online
      <br />
      that you can buy as a human.
    </>
  ),
  groups: [
    { title: "Product", links: [{ label: "Vault", href: "https://www.agentcard.sh/vault" }, { label: "Issuing", href: "https://www.agentcard.sh/issuing" }, { label: "Voice", href: "https://cal.com/team/agentcard/agentcard-call" }, { label: "Purchase Agent", href: "https://www.agentcard.sh/purchase-agent" }, { label: "Pricing", href: "https://www.agentcard.sh/pricing" }, { label: "FAQ", href: "https://www.agentcard.sh/#faq" }] },
    { title: "Developers", links: [{ label: "Documentation", href: "https://docs.agentcard.sh" }, { label: "API reference", href: "https://docs.agentcard.sh/companies/api/reference" }] },
    { title: "Company", links: [{ label: "About", href: "https://www.agentcard.sh/about" }, { label: "Changelog", href: "https://www.agentcard.sh/updates" }, { label: "Trust Center", href: "https://app.vanta.com/agentcard.sh/trust/8t52k9fqhneqwt4y2jpvmn" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "https://legal.raincards.xyz/legal/privacy-policy" }, { label: "Terms of Service", href: "https://www.agentcard.sh/terms" }, { label: "Card Terms", href: "https://www.agentcard.sh/card-terms" }, { label: "Card Terms (International)", href: "https://www.agentcard.sh/card-terms-international" }] },
    { title: "Social", links: [{ label: "X / Twitter", href: "https://x.com/agentcardhq" }, { label: "Instagram", href: "https://www.instagram.com/agentcardhq/" }] },
  ],
  merchants: ["Groceries", "Electronics", "Home goods", "Office supplies", "Apparel", "Food delivery", "Software", "Travel", "Books", "Pet supplies", "Hardware", "Flights"],
};

// The dock as agentcard.sh carries it: Home, the Products menu, About, Pricing, and Get started.
const PRODUCTS = {
  label: "Products",
  items: [
    { title: "Vault", description: "Store customers’ cards and buy with an agent.", href: "https://www.agentcard.sh/vault" },
    { title: "Issuing", description: "One-time and multi-use cards for your agent.", href: "https://www.agentcard.sh/issuing" },
    { title: "Voice", description: "Approve an agent’s purchase by speaking.", href: "https://cal.com/team/agentcard/agentcard-call" },
    { title: "Purchase Agent", description: "Buy from the stores people already use.", href: "https://www.agentcard.sh/purchase-agent" },
  ],
};

const LINKS = [
  { label: "Home", href: "https://www.agentcard.sh/" },
  { label: "About", href: "https://www.agentcard.sh/about" },
  { label: "Pricing", href: "https://www.agentcard.sh/pricing" },
];

const START = { label: "Get started", href: "https://app.agentcard.sh/" };

// A legal page as agentcard.sh draws it (/terms, /card-terms): the bare header, then the document on the reading
// column (Compliance, the title, the date it was last updated, a rule) and its numbered sections in h2s, with no table
// of contents. The blue footer and the glass dock close it. Sample terms in the page's shape; they are not legal text,
// so pass your own.

type LegalSection = { title: string; body: ReactNode };

const SECTIONS: LegalSection[] = [
  { title: "Acceptance of terms", body: <p>By using the website, the cards or the tools for agents (the “Services”), you agree to these terms. If you do not agree, do not use the Services.</p> },
  { title: "Description of services", body: <p>The Services let you store cards, issue cards and let software agents make purchases within limits you set.</p> },
  { title: "Eligibility", body: <p>You must be at least 18 years old and able to form a binding contract to use the Services.</p> },
  { title: "Account registration", body: <p>You agree to give accurate information when you register and to keep your login and API keys secret.</p> },
  {
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Services for any unlawful purpose.</li>
          <li>Attempt unauthorized access to any account or system.</li>
          <li>Interfere with or disrupt the Services.</li>
        </ul>
      </>
    ),
  },
  { title: "Payment and fees", body: <p>Fees are listed on the pricing page. Card fees are set out in the Cardholder Agreement.</p> },
  { title: "Disclaimer of warranties", body: <p>The Services are provided “as is” and “as available”, without warranties of any kind.</p> },
  { title: "Limitation of liability", body: <p>To the extent the law allows, we are not liable for indirect or consequential losses arising from your use of the Services.</p> },
  { title: "Termination", body: <p>We may suspend or end your access if you break these terms. You may stop using the Services at any time.</p> },
  {
    title: "Contact",
    body: (
      <p>
        Questions about these terms go to <a href="mailto:support@agentcard.sh">support@agentcard.sh</a>.
      </p>
    ),
  },
];

export function LegalPage({
  title = "Terms of Use",
  updated = "Last updated July 10, 2026",
  sections = SECTIONS,
}: {
  title?: string;
  updated?: ReactNode;
  sections?: LegalSection[];
}) {
  return (
    <main className="relative">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={START} />
      <div className="mx-auto w-(--ds-frame-column) pt-35 pb-28 md:pt-37.5">
        <Prose eyebrow="Compliance" title={title} meta={updated}>
          {sections.flatMap((section, i) => [<h2 key={`h${i}`}>{section.title}</h2>, <div key={`b${i}`} className="grid gap-4">{section.body}</div>])}
        </Prose>
      </div>
      <SiteFooter backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock menu={PRODUCTS} links={LINKS} action={START} />
    </main>
  );
}

```
