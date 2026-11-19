import { ArrowRight } from "lucide-react";

import { NavDock } from "@/components/site/nav-dock";
import { PageHeader } from "@/components/site/page-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

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

// The blog's index as agentcard.sh draws it (/blog): the bare header, the page's opening on the reading column with the
// count of posts under the title, then every post as a full-width card (its title, a line or two, and Read more), one
// after another, with no pictures or filters. The blue footer and the glass dock close it. Sample posts; pass your own.

type Post = { title: string; excerpt: string; href: string };

const POSTS: Post[] = [
  { title: "How to give an AI agent a card", excerpt: "Store a customer’s card in the Vault, set its limits, and let the agent pay at checkout like a person would.", href: "https://www.agentcard.sh/blog/give-an-agent-a-card" },
  { title: "One-time cards or multi-use cards?", excerpt: "When a card should close after a single purchase, and when a subscription needs one that stays open.", href: "https://www.agentcard.sh/blog/one-time-or-multi-use" },
  { title: "Approving a purchase with a passkey", excerpt: "Why every payment waits for the owner’s passkey or master password, and how it feels on a phone.", href: "https://www.agentcard.sh/blog/passkey-approval" },
  { title: "Setting limits your agent spends under", excerpt: "Per purchase, per day and per merchant: the rules that keep an agent’s spending where you want it.", href: "https://www.agentcard.sh/blog/spending-limits" },
  { title: "Building a shopping agent in iMessage", excerpt: "A step-by-step guide from the first message to the confirmed order, with the Purchase API doing the buying.", href: "https://www.agentcard.sh/blog/imessage-shopping-agent" },
  { title: "What happens when an agent makes a mistake", excerpt: "Disputes from the bank statement, and insurance up to $250 for mistakes the agent makes.", href: "https://www.agentcard.sh/blog/agent-mistakes" },
];

function PostCard({ post }: { post: Post }) {
  return (
    <a href={post.href} className="group block rounded-card outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">
      <Card className="gap-2.5 rounded-card p-6 shadow-card md:p-7">
        <CardTitle className="transition-colors duration-150 ease-out group-hover:text-fg-brand">{post.title}</CardTitle>
        <CardDescription className="text-body leading-relaxed">{post.excerpt}</CardDescription>
        <span className="mt-1.5 inline-flex items-center gap-1.5 font-display text-body-sm text-fg-brand">
          Read more
          <ArrowRight aria-hidden className="size-3.5" />
        </span>
      </Card>
    </a>
  );
}

export function BlogPage({ posts = POSTS }: { posts?: Post[] }) {
  return (
    <main className="relative">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={START} />
      <PageHeader eyebrow="Blog" title="Updates, guides and product news">
        <p className="mt-3 font-display text-caption text-fg-muted">{posts.length} posts</p>
      </PageHeader>
      <ul className="mx-auto grid w-(--ds-frame-column) max-w-(--ds-layout-text) gap-4 pt-10 pb-28">
        {posts.map((post) => (
          <li key={post.href}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <SiteFooter backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock menu={PRODUCTS} links={LINKS} action={START} />
    </main>
  );
}
