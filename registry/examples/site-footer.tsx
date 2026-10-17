import { SiteFooter } from "@/components/site/site-footer";

const DOCS = "https://docs.agentcard.sh";

const GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Vault", href: "https://www.agentcard.sh/vault" },
      { label: "Issuing", href: "https://www.agentcard.sh/issuing" },
      { label: "Voice", href: "https://cal.com/team/agentcard/agentcard-call" },
      { label: "Purchase Agent", href: "https://www.agentcard.sh/purchase-agent" },
      { label: "Pricing", href: "https://www.agentcard.sh/pricing" },
      { label: "FAQ", href: "https://www.agentcard.sh/#faq" },
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
      { label: "About", href: "https://www.agentcard.sh/about" },
      { label: "Changelog", href: "https://www.agentcard.sh/updates" },
      { label: "Trust Center", href: "https://app.vanta.com/agentcard.sh/trust/8t52k9fqhneqwt4y2jpvmn" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "https://legal.raincards.xyz/legal/privacy-policy" },
      { label: "Terms of Service", href: "https://www.agentcard.sh/terms" },
      { label: "Card Terms", href: "https://www.agentcard.sh/card-terms" },
      { label: "Card Terms (International)", href: "https://www.agentcard.sh/card-terms-international" },
      { label: "E-Sign Consent", href: "https://legal.raincards.xyz/legal/electronic-communications-notice" },
      { label: "Prohibited Uses", href: "https://legal.raincards.xyz/legal/prohibitions" },
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
