import { Pricing } from "@/components/site/pricing";

const VAULT = [
  { title: "Store any card", detail: "Consumer, commercial or prepaid, from any country." },
  { title: "Points for customers", detail: "They keep earning on every purchase." },
  { title: "Bank-statement disputes", detail: "A charge is disputed like any other." },
  { title: "Insured up to $250", detail: "Covers the agent’s mistakes." },
  { title: "Auto-approve", detail: "Within the limits customers set." },
  { title: "Rewards routing", detail: "Picks the card that earns the most." },
  { title: "White-labeled", detail: "Your own identity throughout." },
  { title: "Passkey approval", detail: "Or a master password, before anything is paid." },
];

const ENTERPRISE = [
  { title: "Unlimited users", detail: "No cap on the Free plan’s 5,000." },
  { title: "The Vault belongs to you", detail: "And so does every card in it." },
  { title: "Dedicated support", detail: "A named contact and a shared Slack channel." },
  { title: "SLA", detail: "Uptime and response-time guarantees in writing." },
  { title: "SSO and SCIM", detail: "Sign in with your identity provider and provision from it." },
];

const ISSUING = [
  { title: "One-time cards", detail: "A fresh card for every purchase." },
  { title: "Multi-use cards", detail: "With a monthly limit you set." },
  { title: "Spend controls", detail: "Merchants, amounts and approvals per card." },
];

export function Site() {
  return (
    <div className="px-4 pt-16 pb-20 md:px-7.5 md:pt-23 md:pb-28">
      <Pricing
        title="Pricing"
        products={[
          {
            label: "Vault",
            plans: [
              { name: "Vault Free", line: "Store customers’ cards and buy with an agent", price: "Free", unit: "up to 5,000 users", features: VAULT, action: { label: "Start free", href: "https://app.agentcard.sh/" } },
              { name: "Vault Enterprise", line: "Store customers’ cards and buy with an agent", price: "Talk to us", includes: "All features in the Free plan, plus:", features: ENTERPRISE, featured: true, action: { label: "Talk to us", href: "https://cal.com/team/agentcard/agentcard-call" } },
            ],
          },
          {
            label: "Issuing",
            plans: [
              { name: "Issuing", line: "Cards for your own agents", price: "$5,000", unit: "/ month", features: ISSUING, action: { label: "Start now", href: "https://app.agentcard.sh/" } },
              { name: "Issuing Startups", line: "For teams just starting out", price: "Talk to us", includes: "All features in the Issuing plan.", featured: true, action: { label: "Talk to us", href: "https://cal.com/team/agentcard/agentcard-call" } },
            ],
          },
          {
            label: "Purchase Agent",
            plans: [{ name: "Purchase Agent", line: "Our agent inside yours", price: "Talk to us", featured: true, action: { label: "Book a call", href: "https://cal.com/team/agentcard/agentcard-call" } }],
          },
        ]}
      />
    </div>
  );
}
