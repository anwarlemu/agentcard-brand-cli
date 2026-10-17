import { SiteFooter } from "@/components/site/site-footer";

const DOCS = "https://docs.agentcard.sh";

const GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Vault", href: "/vault" },
      { label: "Issuing", href: "/issuing" },
      { label: "Voice", href: "/voice" },
      { label: "Purchase Agent", href: "/purchase-agent" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: DOCS },
      { label: "API reference", href: `${DOCS}/companies/api/reference` },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Changelog", href: "/updates" },
      { label: "Trust Center", href: "#trust" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Card Terms", href: "/card-terms" },
      { label: "Card Terms (International)", href: "/card-terms-international" },
      { label: "E-Sign Consent", href: "#e-sign" },
      { label: "Prohibited Uses", href: "#prohibited" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "X / Twitter", href: "https://x.com/agentcardhq" },
      { label: "Instagram", href: "https://www.instagram.com/agentcardhq/" },
      { label: "TikTok", href: "https://www.tiktok.com/@agentcardhq" },
    ],
  },
];

const MERCHANTS = ["Amazon", "Walmart", "Target", "Best Buy", "Home Depot", "Lowe’s", "Macy’s", "Wayfair", "Staples", "Kohl’s", "B&H Photo", "DoorDash", "Good Eggs", "Locale", "Flights"];

// A stand-in for the backer's logo: a small square in the backer's place, drawn from brand tokens.
function BackerMark() {
  return <span aria-hidden className="inline-block size-[1.05em] rounded-chip bg-sky" />;
}

export function Site() {
  return (
    <div className="bg-surface pt-24">
      <SiteFooter
        bandFrom="white"
        groups={GROUPS}
        merchants={MERCHANTS}
        merchantsLabel="Agents buy at Amazon, Walmart, Target, Best Buy and more."
        backing={
          <>
            <span aria-hidden>Backed by</span>
            <BackerMark />
            <span aria-hidden>Combinator</span>
          </>
        }
        backingLabel="Backed by Y Combinator"
        description={
          <>
            We want agents to buy anything online
            <br />
            that you can buy as a human.
          </>
        }
      />
    </div>
  );
}
