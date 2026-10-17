import { NavDock } from "@/components/site/nav-dock";

const PRODUCTS = {
  label: "Products",
  items: [
    { title: "Vault", description: "Store customers’ cards and buy with an agent. Use customers’ cards; they collect points.", href: "https://www.agentcard.sh/vault" },
    { title: "Issuing", description: "Create one-time and multi-use cards for your agent, under limits you set.", href: "https://www.agentcard.sh/issuing" },
    { title: "Purchase Agent", description: "Integrate our agent into yours and buy from Amazon, DoorDash and many other stores.", href: "https://www.agentcard.sh/purchase-agent" },
  ],
};

const LINKS = [
  { label: "Home", href: "https://www.agentcard.sh/", current: true },
  { label: "About", href: "https://www.agentcard.sh/about" },
  { label: "Pricing", href: "https://www.agentcard.sh/pricing" },
];

function Backdrop() {
  return <div className="h-svh min-h-125 bg-brand" />;
}

export function Site() {
  return (
    <>
      <Backdrop />
      <NavDock links={LINKS} menu={PRODUCTS} action={{ label: "Get started", href: "https://app.agentcard.sh/" }} center="Backed by Y Combinator" />
    </>
  );
}

export function Open() {
  return (
    <>
      <Backdrop />
      <NavDock links={LINKS} menu={PRODUCTS} action={{ label: "Get started", href: "https://app.agentcard.sh/" }} defaultOpen="Products" />
    </>
  );
}

export function OnWhite() {
  return (
    <>
      <div className="h-svh min-h-125 bg-surface" />
      <NavDock links={LINKS.map((l) => ({ ...l, current: l.label === "Pricing" }))} menu={PRODUCTS} action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
    </>
  );
}
