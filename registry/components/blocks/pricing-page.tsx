import { NavDock } from "@/components/site/nav-dock";
import { Pricing } from "@/components/site/pricing";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

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
          ]}
        />
      </div>
      <SiteFooter
        backing="Backed by Y Combinator"
        groups={[
          { title: "Product", links: [{ label: "Vault", href: "/vault" }, { label: "Issuing", href: "/issuing" }] },
          { title: "Company", links: [{ label: "About", href: "/about" }] },
        ]}
      />
      <NavDock
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
