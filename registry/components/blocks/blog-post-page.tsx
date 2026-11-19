import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { NavDock } from "@/components/site/nav-dock";
import { Prose } from "@/components/site/prose";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/window";

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

// A blog post as agentcard.sh draws it (/blog/<post>): the bare header, a link back to the blog, then the article on the
// reading column (the title, the published and updated dates, a rule, the body in h2 sections with numbered and bulleted
// lists), a short Try it window with the two next steps, the blue footer and the glass dock. Sample article; pass your
// rendered Markdown as children.

function Article() {
  return (
    <>
      <p>An agent that can buy things needs a card it is allowed to use, limits it cannot cross, and an owner who approves what matters. This guide sets up all three in a few minutes.</p>
      <h2>What you need</h2>
      <ul>
        <li>An Agentcard account and an API key.</li>
        <li>An agent that can call a tool or an HTTP endpoint.</li>
        <li>A customer with a card to store, or a balance to issue cards from.</li>
      </ul>
      <h2>Steps</h2>
      <ol>
        <li>Store the customer’s card in the Vault. It is encrypted on their device before it is saved.</li>
        <li>Set the limits the agent spends under: per purchase, per day and per merchant.</li>
        <li>
          Give your agent the buy tool, or run <code>npx agent-cards setup</code> from your editor.
        </li>
        <li>Ask the agent for something. The owner approves with a passkey and the agent pays at checkout.</li>
      </ol>
      <h2>Before you go live</h2>
      <ul>
        <li>Turn on auto-approve only for small, routine purchases.</li>
        <li>Check that disputes reach your support inbox.</li>
        <li>Read the card terms for the countries you serve.</li>
      </ul>
    </>
  );
}

export function BlogPostPage({
  title = "How to give an AI agent a card",
  meta = "Published Oct 20, 2026 · Updated Oct 27, 2026",
  children = <Article />,
}: {
  title?: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <main className="relative">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={START} />
      <div className="mx-auto w-(--ds-frame-column) max-w-(--ds-layout-text) pt-35 pb-28 md:pt-37.5">
        <a href="https://www.agentcard.sh/blog" className="mb-6 inline-flex items-center gap-1.5 rounded-chip font-display text-caption text-fg-muted outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">
          <ArrowLeft aria-hidden className="size-3.5" />
          Blog
        </a>
        <Prose eyebrow="Guide" title={title} meta={meta}>
          {children}
        </Prose>
        <Window name="try-it.md" className="mt-14" bodyClassName="grid gap-4 p-6">
          <div>
            <p className="font-display text-h4 leading-snug font-medium tracking-tight">Try it</p>
            <p className="mt-1.5 text-body-sm leading-relaxed text-fg-muted">Follow the quickstart, or get started and give your agent its first card.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={START.href}>Get started</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="https://docs.agentcard.sh">Read the quickstart</a>
            </Button>
          </div>
        </Window>
      </div>
      <SiteFooter backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock menu={PRODUCTS} links={LINKS} action={START} />
    </main>
  );
}
