import { SiteHeader } from "@/components/site/site-header";

export function Site() {
  return (
    <div className="relative h-50 bg-brand">
      <SiteHeader href="https://www.agentcard.sh/" ground="blue" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
    </div>
  );
}

export function White() {
  return (
    <div className="relative h-50 bg-surface">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
    </div>
  );
}

export function WithLinks() {
  return (
    <div className="relative h-50 bg-surface">
      <SiteHeader href="https://www.agentcard.sh/"
        ground="white"
        links={[
          { label: "Vault", href: "https://www.agentcard.sh/vault" },
          { label: "Issuing", href: "https://www.agentcard.sh/issuing" },
          { label: "Pricing", href: "https://www.agentcard.sh/pricing", current: true },
        ]}
        action={{ label: "Get started", href: "https://app.agentcard.sh/" }}
      />
    </div>
  );
}
