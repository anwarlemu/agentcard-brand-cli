import { SiteHeader } from "@/components/site/site-header";

export function Site() {
  return (
    <div className="relative h-50 bg-brand">
      <SiteHeader ground="blue" action={{ label: "Get started", href: "#" }} />
    </div>
  );
}

export function White() {
  return (
    <div className="relative h-50 bg-surface">
      <SiteHeader ground="white" action={{ label: "Get started", href: "#" }} />
    </div>
  );
}

export function WithLinks() {
  return (
    <div className="relative h-50 bg-surface">
      <SiteHeader
        ground="white"
        links={[
          { label: "Vault", href: "#vault" },
          { label: "Issuing", href: "#issuing" },
          { label: "Pricing", href: "#pricing", current: true },
        ]}
        action={{ label: "Get started", href: "#" }}
      />
    </div>
  );
}
