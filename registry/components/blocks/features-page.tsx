import { FeatureGrid, FeatureRows } from "@/components/site/feature-rows";
import { Hero } from "@/components/site/hero";
import { LogoStrip } from "@/components/site/logo-strip";
import { NavDock } from "@/components/site/nav-dock";
import { SectionHeading, SiteSection } from "@/components/site/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Testimonials } from "@/components/site/testimonials";
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

// A product's own page as agentcard.sh draws it (/vault, /issuing): the blue hero with the product's promise, the
// stepped band onto the paper, the features one to a row, the secondary features as a grid, the use cases on the trail,
// the customers, the blue footer and the glass dock. The Vault's copy as the page carries it; sample companies stand in
// for the cases and customers, and neutral screens for the product's own. Replace them with yours.

function Tile({ className }: { className: string }) {
  return <span aria-hidden className={`absolute rounded-card opacity-80 shadow-card ${className}`} />;
}

function Scene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <Tile className="top-[14%] left-[6%] size-20 rotate-12 bg-sky" />
      <Tile className="top-[78%] left-[8%] md:top-[58%] md:left-[16%] h-16 w-24 -rotate-6 bg-white" />
      <Tile className="top-[20%] right-[8%] h-20 w-28 rotate-6 bg-white" />
      <Tile className="top-[84%] right-[10%] md:top-[64%] md:right-[18%] size-16 -rotate-12 bg-sky" />
    </div>
  );
}

// A neutral phone made from brand tokens, standing in for the product's own screen.
function Phone({ title, lines = 3 }: { title: string; lines?: number }) {
  return (
    <div className="w-68 shrink-0 rounded-[var(--ds-space-12)] bg-ink p-2.25 shadow-code">
      <div className="min-h-130 rounded-[calc(var(--ds-space-12)-var(--ds-space-2))] bg-surface px-5 pt-4">
        <div className="mb-6 flex items-center justify-between font-display text-caption">
          <span>9:41</span>
          <span aria-hidden className="h-6 w-21 rounded-pill bg-ink" />
          <span aria-hidden className="h-2.5 w-6 rounded-chip bg-ink" />
        </div>
        <p className="mb-4 font-display text-h4 font-medium tracking-tight">{title}</p>
        <div className="grid gap-2.5">
          {Array.from({ length: lines }, (_, i) => (
            <span key={i} aria-hidden className="h-9 rounded-control border border-hairline bg-subtle" />
          ))}
          <span aria-hidden className="mt-2 h-9 rounded-control bg-ink" />
        </div>
      </div>
    </div>
  );
}

function Rules({ name }: { name: string }) {
  return (
    <Window name={name} className="w-full max-w-115" bodyClassName="grid gap-2 p-5">
      <span aria-hidden className="h-3 w-2/3 rounded-chip bg-subtle" />
      <span aria-hidden className="h-3 w-1/2 rounded-chip bg-subtle" />
      <span aria-hidden className="h-3 w-3/5 rounded-chip bg-subtle" />
    </Window>
  );
}

const Glyph = ({ d }: { d: string }) => (
  <svg viewBox="0 0 20 20" className="fill-current">
    <path d={d} />
  </svg>
);

const FEATURES = [
  { title: "Store any card", description: "Works with any card from any country: consumer, commercial or prepaid.", media: <Phone title="Add your card" /> },
  { title: "Get points", description: "Customers get points on their purchases just like when they buy things themselves.", media: <Phone title="Points" lines={2} /> },
  { title: "Dispute transactions", description: "If agents make mistakes, customers can dispute transactions just from their bank statements.", media: <Phone title="Dispute" lines={2} /> },
  { title: "Insurance up to $250", description: "Your customers need to feel safe when buying with their agent. We insure up to $250 for mistakes the agent makes.", media: <Phone title="Agent mistake" lines={1} /> },
  { title: "Auto-approve transactions", description: "Customers can choose to auto-approve transactions within certain limits.", align: "center" as const, media: <Rules name="limits.rules" /> },
];

const MORE = [
  { title: "Any messaging platform", description: "Use the Vault if you are building for web, WhatsApp, iMessage or any other platform.", media: <Phone title="Your agent" /> },
  { title: "Authorize with a passkey", description: "Users approve payments on their own device with their passkey or master password.", media: <Phone title="Approve payment" lines={2} /> },
  { title: "Encrypted cards", description: "Cards are encrypted on the user’s device before they’re stored.", media: <Phone title="Card saved" lines={1} /> },
  { title: "Integrations with agent browsers", description: "Works with the tools you already use: most agent browsers, e-commerce APIs and messaging APIs.", media: <Phone title="Checkout" /> },
];

export function FeaturesPage() {
  return (
    <main className="relative">
      <Hero
        header={<SiteHeader href="https://www.agentcard.sh/" ground="blue" action={START} />}
        background={<Scene />}
        eyebrow="Vault"
        title="Store customer cards and buy with an agent"
        titleClassName="max-w-[16ch]"
        subtitle="Use customers’ cards, they collect points."
        bandTo="paper"
      />

      <SiteSection ground="paper" id="features">
        <SectionHeading title="Features" className="mb-10 lg:mb-14" />
        <FeatureRows product="Vault" rows={FEATURES} />
      </SiteSection>

      <SiteSection ground="paper">
        <SectionHeading title="Secondary features" className="mb-10 lg:mb-14" />
        <FeatureGrid product="Vault" rows={MORE} />
      </SiteSection>

      <SiteSection ground="paper">
        <SectionHeading title="Use cases" description="Teams of every kind give their agents cards with the Vault." />
        <Testimonials
          cases={[
            { name: "Acme", logo: <Glyph d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z" />, context: "Consumer apps like Acme buy for their customers:", quote: "Acme stores customers’ cards safely and buys things on their behalf.”", tag: "Consumer" },
            { name: "Globex", logo: <Glyph d="M3 3h14v14H3Z" />, context: "B2B companies like Globex give cards to company agents:", quote: "Globex stores corporate cards and automates company purchases with its team agent.”", tag: "B2B" },
          ]}
        />
      </SiteSection>

      <SiteSection ground="paper">
        <SectionHeading title="Working with Agentcard" description="Personal assistant companies use Agentcard as their payment infrastructure." />
        <LogoStrip customers={["Acme", "Acme Labs", "Globex", "Initech", "Northwind", "Contoso", "Fabrikam", "Vandelay"].map((name) => ({ name }))} />
      </SiteSection>

      <SiteFooter bandFrom="paper" backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock links={LINKS} menu={{ ...PRODUCTS, current: true }} action={START} />
    </main>
  );
}
