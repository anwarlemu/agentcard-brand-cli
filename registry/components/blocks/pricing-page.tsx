import { NavDock } from "@/components/site/nav-dock";
import { Pricing } from "@/components/site/pricing";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

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
    { title: "Product", links: [{ label: "Vault", href: "/vault" }, { label: "Issuing", href: "/issuing" }, { label: "Voice", href: "/voice" }, { label: "Purchase Agent", href: "/purchase-agent" }, { label: "Pricing", href: "/pricing" }, { label: "FAQ", href: "/#faq" }] },
    { title: "Developers", links: [{ label: "Documentation", href: "https://docs.agentcard.sh" }, { label: "API reference", href: "https://docs.agentcard.sh/api-reference" }] },
    { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Changelog", href: "/updates" }, { label: "Trust Center", href: "/trust" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Card Terms", href: "/card-terms" }, { label: "Card Terms (International)", href: "/card-terms-international" }] },
    { title: "Social", links: [{ label: "X / Twitter", href: "https://x.com/agentcardhq" }, { label: "Instagram", href: "https://www.instagram.com/agentcardhq/" }] },
  ],
  merchants: ["Amazon", "Walmart", "Target", "Best Buy", "Home Depot", "Lowe’s", "Macy’s", "Wayfair", "Staples", "DoorDash", "Good Eggs", "Flights"],
};

// The dock as agentcard.sh carries it: Home, the Products menu, About, Pricing, and Get started.
const PRODUCTS = {
  label: "Products",
  items: [
    { title: "Vault", description: "Store customers’ cards and buy with an agent.", href: "/vault" },
    { title: "Issuing", description: "One-time and multi-use cards for your agent.", href: "/issuing" },
    { title: "Voice", description: "Approve an agent’s purchase by speaking.", href: "/voice" },
    { title: "Purchase Agent", description: "Buy from Amazon, DoorDash and more.", href: "/purchase-agent" },
  ],
};

// The pricing page as agentcard.sh draws it: the bare header on white, the product tabs over the plan windows, the
// blue footer and the glass dock. Sample plans; replace them with your own.

export function PricingPage() {
  return (
    <main className="relative">
      <SiteHeader ground="white" action={{ label: "Get started", href: "/get-started" }} />
      <div className="pt-20 pb-28">
        <Pricing
          title="Pricing"
          products={[
            {
              label: "Vault",
              plans: [
                {
                  name: "Vault Free",
                  line: "Store customers’ cards and buy with an agent",
                  price: "Free",
                  unit: "up to 5,000 users",
                  features: [
                    { title: "Store any card", detail: "Consumer, commercial or prepaid, from any country." },
                    { title: "Passkey approval", detail: "Or a master password, before anything is paid." },
                    { title: "Encrypted on the device", detail: "Cards are encrypted before they’re stored." },
                  ],
                  action: { label: "Start free", href: "/get-started" },
                },
                {
                  name: "Vault Enterprise",
                  line: "Store customers’ cards and buy with an agent",
                  price: "Talk to us",
                  includes: "All features in the Free plan, plus:",
                  features: [
                    { title: "Unlimited users", detail: "No cap on the Free plan’s 5,000." },
                    { title: "Dedicated support", detail: "A named contact and a shared Slack channel." },
                  ],
                  action: { label: "Talk to us", href: "/get-started" },
                  featured: true,
                },
              ],
            },
            {
              label: "Issuing",
              plans: [
                {
                  name: "Issuing",
                  line: "Create one-time and multi-use cards for your agent",
                  price: "$5,000",
                  unit: "/ month",
                  features: [{ title: "Unlimited cards", detail: "One-time or multi-use, with limits you set." }],
                  action: { label: "Get started", href: "/get-started" },
                },
              ],
            },
            {
              label: "Purchase Agent",
              plans: [
                {
                  name: "Purchase Agent",
                  line: "Integrate our agent into yours and buy from online stores",
                  price: "Talk to us",
                  features: [
                    { title: "Amazon, DoorDash and more", detail: "The stores your users already buy from." },
                    { title: "Pays with the Vault", detail: "The user’s own card, approved on their device." },
                  ],
                  action: { label: "Talk to us", href: "/get-started" },
                },
              ],
            },
          ]}
        />
      </div>
      <SiteFooter backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock
        menu={PRODUCTS}
        links={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Pricing", href: "/pricing", current: true },
        ]}
        action={{ label: "Get started", href: "/get-started" }}
      />
    </main>
  );
}
