import { NavDock } from "@/components/site/nav-dock";
import { PageHeader } from "@/components/site/page-header";
import { Eyebrow } from "@/components/site/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TeamDirectory } from "@/components/site/team-directory";

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
      <SiteHeader ground="white" action={{ label: "Get started", href: "/get-started" }} />
      <PageHeader
        eyebrow="The company"
        title="About"
        lead="We are building Agentcard because we believe agents should have full autonomy to pay for things online. That is why we are starting with cards."
      />
      <div className="mx-auto grid w-(--ds-frame-column) max-w-(--ds-layout-text) gap-16 pt-16 pb-28">
        <section aria-label="Team">
          <Eyebrow className="mb-3.5">Team</Eyebrow>
          <TeamDirectory name="team.dir" tone="blue" columns={2} people={[person("Ada Okafor", "CEO & Co-Founder"), person("Luis Romero", "CTO & Co-Founder")]} />
        </section>
        <section aria-label="Investors">
          <Eyebrow className="mb-3.5">Investors</Eyebrow>
          <TeamDirectory
            name="investors.dir"
            columns={3}
            people={[person("Priya Raman", "Co-founder, a fund"), person("Tom Becker", "CEO, a commerce platform"), person("Elena Ruiz", "CTO, a CRM")]}
            footer={[{ label: "Backed by Y Combinator", href: "https://www.ycombinator.com" }]}
          />
        </section>
      </div>
      <SiteFooter
        backing="Backed by Y Combinator"
        groups={[
          { title: "Product", links: [{ label: "Vault", href: "/vault" }, { label: "Pricing", href: "/pricing" }] },
          { title: "Company", links: [{ label: "About", href: "/about" }] },
        ]}
      />
      <NavDock
        links={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about", current: true },
          { label: "Pricing", href: "/pricing" },
        ]}
        action={{ label: "Get started", href: "/get-started" }}
      />
    </main>
  );
}
