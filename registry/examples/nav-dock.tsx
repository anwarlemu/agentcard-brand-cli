import { NavDock } from "@/components/site/nav-dock";

const PRODUCTS = {
  label: "Products",
  items: [
    { title: "Vault", description: "Store customers’ cards and buy with an agent. Use customers’ cards; they collect points.", href: "#vault" },
    { title: "Issuing", description: "Create one-time and multi-use cards for your agent, under limits you set.", href: "#issuing" },
    { title: "Purchase Agent", description: "Integrate our agent into yours and buy from Amazon, DoorDash and many other stores.", href: "#purchase-agent" },
  ],
};

const LINKS = [
  { label: "Home", href: "#", current: true },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

function Backdrop() {
  return <div className="h-svh min-h-125 bg-brand" />;
}

export function Site() {
  return (
    <>
      <Backdrop />
      <NavDock links={LINKS} menu={PRODUCTS} action={{ label: "Get started", href: "#" }} center="Backed by Y Combinator" />
    </>
  );
}

export function Open() {
  return (
    <>
      <Backdrop />
      <NavDock links={LINKS} menu={PRODUCTS} action={{ label: "Get started", href: "#" }} defaultOpen="Products" />
    </>
  );
}

export function OnWhite() {
  return (
    <>
      <div className="h-svh min-h-125 bg-surface" />
      <NavDock links={LINKS.map((l) => ({ ...l, current: l.label === "Pricing" }))} menu={PRODUCTS} action={{ label: "Get started", href: "#" }} />
    </>
  );
}
