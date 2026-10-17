import { ArrowUpRight } from "lucide-react";

import { Faq } from "@/components/site/faq";
import { Hero } from "@/components/site/hero";
import { IntegrationCode, IntegrationScreen, Integrations } from "@/components/site/integrations";
import { LogoStrip } from "@/components/site/logo-strip";
import { NavDock } from "@/components/site/nav-dock";
import { ProductGrid } from "@/components/site/product-grid";
import { SectionHeading, SiteSection } from "@/components/site/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Testimonials } from "@/components/site/testimonials";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/window";

// The home page as agentcard.sh draws it: the blue hero, the customer cases, the products, the integrations, the
// customers and the FAQ, the blue footer, and the glass dock. Sample content in its shape; replace it with your own,
// and the stand-in pictures with your imagery.

const NAV = {
  links: [
    { label: "Home", href: "/", current: true },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
  ],
  menu: {
    label: "Products",
    items: [
      { title: "Vault", description: "Store customers’ cards and buy with an agent.", href: "/vault" },
      { title: "Issuing", description: "One-time and multi-use cards for your agent.", href: "/issuing" },
      { title: "Purchase Agent", description: "Buy from Amazon, DoorDash and more.", href: "/purchase-agent" },
    ],
  },
  action: { label: "Get started", href: "/get-started" },
};

const Glyph = ({ d }: { d: string }) => (
  <svg viewBox="0 0 20 20" className="fill-current">
    <path d={d} />
  </svg>
);

function Tile({ className }: { className: string }) {
  return <span aria-hidden className={`absolute rounded-card opacity-80 shadow-card ${className}`} />;
}

function Scene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <Tile className="top-[14%] left-[6%] size-20 rotate-12 bg-sky" />
      <Tile className="top-[58%] left-[16%] h-16 w-24 -rotate-6 bg-white" />
      <Tile className="top-[20%] right-[8%] h-20 w-28 rotate-6 bg-white" />
      <Tile className="top-[64%] right-[18%] size-16 -rotate-12 bg-sky" />
    </div>
  );
}

function CardStack() {
  return (
    <div className="relative h-56 w-80 max-w-full">
      <div className="absolute inset-x-6 top-16 h-32 -rotate-2 rounded-card border border-hairline bg-surface shadow-tile" />
      <div className="absolute inset-x-2 top-0 flex h-32 -rotate-3 flex-col justify-between rounded-card bg-inverse p-4 text-on-brand shadow-tile">
        <span className="font-display text-body-sm">agentcard</span>
        <span className="self-end font-display text-caption">···· 4832</span>
      </div>
    </div>
  );
}

function Screen({ name, rows }: { name: string; rows: string[] }) {
  return (
    <Window name={name} className="w-full max-w-md -rotate-1">
      <ul className="grid gap-2 p-4 text-caption">
        {rows.map((row) => (
          <li key={row} className="flex items-center justify-between rounded-sm border border-hairline px-3 py-2">
            {row}
          </li>
        ))}
      </ul>
    </Window>
  );
}

const CODE = `await client.vaults.items.upsert('order', {
  type: 'card',
  spec: { provider: 'agentcard',
    merchant: 'amazon.com', amount: 2306 },
});`;

export function HomePage() {
  return (
    <main>
      <Hero
        header={<SiteHeader ground="blue" action={NAV.action} />}
        background={<Scene />}
        title="Let agents buy anything online"
        subtitle="Cards your agents can use anywhere, under limits you set."
        actions={
          <Button asChild variant="on-brand">
            <a href={NAV.action.href}>Get started</a>
          </Button>
        }
      />

      <SiteSection>
        <SectionHeading title="Powering payments for agentic startups" description="Consumer apps, B2B companies and crypto teams run their agents’ purchases on Agentcard." />
        <Testimonials
          cases={[
            { name: "Orchid", logo: <Glyph d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z" />, context: "Consumer apps like Orchid buy for customers using Agentcard:", quote: "Orchid uses Agentcard to store customers’ cards safely and buy things on their behalf.”", tag: "Consumer" },
            { name: "Almanac", logo: <Glyph d="M3 3h14v14H3Z" />, context: "B2B companies like Almanac give cards to company agents:", quote: "Almanac stores corporate cards using Agentcard and automates company purchases with their Slack agent.”", tag: "B2B" },
            { name: "Laso Finance", file: "laso.case", logo: <Glyph d="M3 5l7-3 7 3v10l-7 3-7-3Z" />, context: "Crypto companies like Laso use it as their payment infrastructure:", quote: "Users with funds in crypto can create cards their agent can use.”", tag: "Crypto" },
          ]}
        />
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Explore our products" description="Vault, Issuing and the Purchase Agent: what an agent needs to pay for things." className="mb-10 lg:mb-18" />
        <ProductGrid
          products={[
            { layout: "lead", title: "Vault", description: "Store customers’ cards and make purchases with agents safely.", action: { label: "Explore Vault", href: "/vault" }, media: <CardStack /> },
            { layout: "half", title: "Purchase Agent", description: "Integrate our agent into yours and buy from many online stores.", action: { label: "Read the docs", href: "#", icon: <ArrowUpRight /> }, media: <Screen name="purchase.agent" rows={["Amazon", "DoorDash", "Walmart"]} /> },
            { layout: "half", title: "Issuing", description: "Create one-time and multi-use cards for your agent.", action: { label: "Explore Issuing", href: "/issuing" }, media: <Screen name="issuing.product" rows={["Agentcard ···· 4832", "Agentcard ···· 7719"]} /> },
          ]}
        />
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Integrates natively with the tools you use" description="The browsers and messaging platforms your agent already runs on." className="mb-9" />
        <Integrations
          rows={[
            {
              title: "Browser integrations",
              description: "Integrate with your agent’s browser and automate purchases online.",
              options: ["Kernel", "Browserbase", "Your own browser"].map((tool) => ({
                label: tool,
                panel: (
                  <>
                    <IntegrationCode name={`${tool.toLowerCase().replaceAll(" ", "-")}.ts`}>{CODE}</IntegrationCode>
                    <IntegrationScreen name={tool.toUpperCase()} address="vault · user-12345">
                      <p className="text-micro">The card is swapped in at checkout</p>
                    </IntegrationScreen>
                  </>
                ),
              })),
            },
          ]}
        />
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Working with Agentcard" description="Personal assistant companies use Agentcard as their payment infrastructure." />
        <LogoStrip customers={["Orchid", "Pally", "Almanac", "Endstack", "Pickle", "Persona", "Ego", "Orgo"].map((name) => ({ name }))} />
      </SiteSection>

      <SiteSection id="faq">
        <Faq
          bar="faq.help / Agentcard"
          title="Frequently asked questions"
          lead="Everything you need to know about Agentcard."
          topics={[
            {
              label: "General",
              items: [
                { question: "What does Agentcard do?", answer: "It lets AI agents buy anything online: it stores your customers’ cards or issues new ones, and pays where a human would." },
                { question: "Does the merchant need to integrate anything?", answer: "No. The agent pays at checkout with a card, as a person would." },
              ],
            },
            { label: "Vault", items: [{ question: "Where are the cards stored?", answer: "Cards are encrypted on the user’s device before they are stored." }] },
            { label: "Issuing", items: [{ question: "How are the cards funded?", answer: "From a balance you top up." }] },
          ]}
        />
      </SiteSection>

      <SiteFooter
        backing="Backed by Y Combinator"
        description={
          <>
            We want agents to buy anything online
            <br />
            that you can buy as a human.
          </>
        }
        groups={[
          { title: "Product", links: [{ label: "Vault", href: "/vault" }, { label: "Issuing", href: "/issuing" }, { label: "Pricing", href: "/pricing" }] },
          { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Changelog", href: "/updates" }] },
          { title: "Legal", links: [{ label: "Terms of Service", href: "/terms" }, { label: "Card Terms", href: "/card-terms" }] },
        ]}
        merchants={["Amazon", "Walmart", "Target", "Best Buy", "Home Depot", "DoorDash"]}
      />

      <NavDock links={NAV.links} menu={NAV.menu} action={NAV.action} />
    </main>
  );
}
