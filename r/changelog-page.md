# Changelog page
Changelog template with the Updates head, a feed of dated changes, footer and navigation.

Install: npx agentcard-ds add changelog-page
Requires: theme, nav-dock, prose, site-footer, site-header, updates-feed
Packages: none
Exports: ChangelogPage
Client boundary: not required by this entry file
Reference: Not in the agentcard-website source yet; agentcard.sh /updates (computed: .v7-upd-feed, .v7-about-head)


## Usage
Use as a starting point for an Agentcard changelog. Pass days, newest first, with Added, Improved and Fixed groups.
- Avoid: Tags other than Added
- Avoid: Improved and Fixed
- Avoid: Oldest entries first
- Avoid: Long paragraphs in place of bullets
- Avoid: Dates in sentence case


## Examples
Example components: npx agentcard-ds add changelog-page
[Block](https://agentcard-ds.vercel.app/preview/changelog-page/Block)

examples/changelog-page.tsx

```tsx
import { ChangelogPage } from "@/components/blocks/changelog-page";

export function Block() {
  return <ChangelogPage />;
}

```

## Source

components/blocks/changelog-page.tsx

```tsx
import { NavDock } from "@/components/site/nav-dock";
import { Prose } from "@/components/site/prose";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { UpdatesFeed, type UpdateDay } from "@/components/site/updates-feed";

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

// The changelog as agentcard.sh draws it (/updates): the bare header, the page's head on the wider column (Changelog,
// Updates, and a small caps line), then one ruled row per day, newest first, its changes under Added, Improved and
// Fixed. The blue footer and the glass dock close it. Sample entries; pass your own days.

const DAYS: UpdateDay[] = [
  {
    date: "Tue Oct 27",
    dateTime: "2026-10-27",
    entries: [
      { tag: "Added", items: ["A company can name its shopper agent, and the name shows on every message the agent sends.", "Purchase API answers now carry the merchant’s order number once the order is placed."] },
      { tag: "Improved", items: ["A company now opens up to 10,000 cards at once.", "Card limits save as you type, with no separate save step."] },
      { tag: "Fixed", items: ["A card payment no longer fails when the merchant retries it."] },
    ],
  },
  {
    date: "Mon Oct 26",
    dateTime: "2026-10-26",
    entries: [
      {
        tag: "Added",
        title: "Set up from your editor",
        body: "One command adds the card tools to your coding agent and walks you through the first purchase.",
        media: (
          <div role="img" aria-label="A screen recording of the setup" className="flex aspect-video items-center justify-center bg-brand">
            <span aria-hidden className="flex size-14 items-center justify-center rounded-pill bg-white text-fg-brand shadow-key">▶</span>
          </div>
        ),
      },
    ],
  },
  {
    date: "Fri Oct 23",
    dateTime: "2026-10-23",
    entries: [
      { tag: "Improved", items: ["A shopper with no login merges into their account the first time they sign in."] },
      { tag: "Fixed", items: ["An iPhone with its passkey in a second keychain approves on the first try.", "On a vague shopping request the agent asks one question before it searches."] },
    ],
  },
  {
    date: "Wed Oct 21",
    dateTime: "2026-10-21",
    entries: [{ tag: "Added", items: ["Issuing cards can now be funded by the company or by each user’s own wallet.", "Webhooks for approved, declined and refunded purchases."] }],
  },
];

export function ChangelogPage({ days = DAYS }: { days?: UpdateDay[] }) {
  return (
    <main className="relative">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={START} />
      <div className="mx-auto w-(--ds-frame-column) pt-35 pb-28 md:pt-37.5">
        <Prose wide eyebrow="Changelog" title="Updates" meta={<>Shipping daily · Last entry {days[0]?.date}</>} bodyClassName="hidden" />
        <UpdatesFeed days={days} className="mx-auto mt-2 max-w-205" />
      </div>
      <SiteFooter backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock menu={PRODUCTS} links={LINKS} action={START} />
    </main>
  );
}

```
