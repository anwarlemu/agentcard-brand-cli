import { NavDock } from "@/components/site/nav-dock";
import { PageHeader } from "@/components/site/page-header";
import { Eyebrow } from "@/components/site/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TeamDirectory } from "@/components/site/team-directory";

// The footer as agentcard.sh carries it on every page: five columns, the line, the running merchant names.
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
  merchants: ["Amazon", "Walmart", "Target", "Best Buy", "Home Depot", "Lowe’s", "Macy’s", "Wayfair", "Staples", "DoorDash", "Good Eggs", "Flights"],
};

// The dock as agentcard.sh carries it: Home, the Products menu, About, Pricing, and Get started.
const PRODUCTS = {
  label: "Products",
  items: [
    { title: "Vault", description: "Store customers’ cards and buy with an agent.", href: "https://www.agentcard.sh/vault" },
    { title: "Issuing", description: "One-time and multi-use cards for your agent.", href: "https://www.agentcard.sh/issuing" },
    { title: "Voice", description: "Approve an agent’s purchase by speaking.", href: "https://cal.com/team/agentcard/agentcard-call" },
    { title: "Purchase Agent", description: "Buy from Amazon, DoorDash and more.", href: "https://www.agentcard.sh/purchase-agent" },
  ],
};

// The about page as agentcard.sh draws it: the bare header, the page's opening on the reading column, the team and the
// investors in directory windows, the blue footer and the glass dock. Sample people; replace them with your own.

function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <span role="img" aria-label={`Photo of ${name}`} className="flex items-center justify-center bg-sky font-display text-body-sm text-fg-brand">
      {letters}
    </span>
  );
}

const person = (name: string, role: string) => ({ name, role, photo: <Initials name={name} /> });

export function AboutPage() {
  return (
    <main className="relative">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
      <PageHeader
        eyebrow="The company"
        title="About"
        lead="We are building Agentcard because we believe agents should have full autonomy to pay for things online. That is why we are starting with cards."
      />
      <div className="mx-auto grid w-(--ds-frame-column) max-w-(--ds-layout-text) gap-16 pt-16 pb-28">
        <section aria-label="Team">
          <Eyebrow className="mb-3.5">Team</Eyebrow>
          <TeamDirectory name="team.dir" tone="blue" columns={2} people={[person("Ada Okafor", "CEO & Co-Founder"), person("Luis Romero", "CTO & Co-Founder"), person("Mara Lindqvist", "Member of Technical Staff"), person("Noor Haddad", "Member of Marketing Staff")]} />
          <p className="mt-3.5 text-body-sm text-fg-muted">
            We are not hiring, but you can always send us an{" "}
            <a href="mailto:support@agentcard.sh" className="text-fg underline decoration-line-brand underline-offset-[0.2em] transition-colors duration-150 ease-out hover:text-fg-brand">
              email
            </a>
            .
          </p>
        </section>
        <section aria-label="Investors">
          <Eyebrow className="mb-3.5">Investors</Eyebrow>
          <TeamDirectory
            name="investors.dir"
            columns={3}
            people={[person("Priya Raman", "Co-founder, a fund"), person("Tom Becker", "CEO, a commerce platform"), person("Elena Ruiz", "CTO, a CRM"), person("Sam Wu", "CEO, an auth company"), person("Jonas Berg", "CEO, a cloud"), person("Ines Duarte", "Board, an AI lab")]}
            footer={[{ label: "Backed by Y Combinator", href: "https://www.ycombinator.com" }, { label: "Pioneer", href: "https://pioneerfund.vc" }]}
          />
        </section>
      </div>
      <SiteFooter backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock
        menu={PRODUCTS}
        links={[
          { label: "Home", href: "https://www.agentcard.sh/" },
          { label: "About", href: "https://www.agentcard.sh/about", current: true },
          { label: "Pricing", href: "https://www.agentcard.sh/pricing" },
        ]}
        action={{ label: "Get started", href: "https://app.agentcard.sh/" }}
      />
    </main>
  );
}
