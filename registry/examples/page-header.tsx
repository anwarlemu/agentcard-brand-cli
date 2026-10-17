import { PageHeader } from "@/components/site/page-header";
import { SiteHeader } from "@/components/site/site-header";

export function Site() {
  return (
    <div className="relative bg-surface pb-24">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
      <PageHeader
        eyebrow="The company"
        title="About"
        lead="We are building Agentcard because we believe agents should have full autonomy to pay for things online. We want to give agents the freedom to operate in the world as it is today, not someday."
      />
    </div>
  );
}

export function Short() {
  return (
    <div className="relative bg-surface pb-24">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
      <PageHeader eyebrow="Get started" title="Let your agent buy">
        <p className="mt-3 font-display text-caption text-fg-muted">A few answers, then a call</p>
      </PageHeader>
    </div>
  );
}
