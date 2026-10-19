# Site footer
Footer with navigation groups, logos and optional merchant list.

Install: npx agentcard-ds add site-footer
Requires: theme, logo, band-divider, marquee, striped-wordmark, utils
Packages: none
Exports: SiteFooter, FooterGroup, FooterLink, SiteFooterProps
Client boundary: not required by this entry file
Reference: agentcard-website src/components/v7/site-footer.tsx; src/app/globals.css:5049 (.v7-foot); agentcard.sh / (computed)


## Usage
Provide link groups, description and optional backing content. Check that every link resolves. Add an id when NavDock uses hideAt.
- Avoid: A white footer
- Avoid: Icons beside every link
- Avoid: More than six columns
- Avoid: Bold headings
- Avoid: A second wordmark
`SiteFooter` props: `groups` ({ title, links: { label, href, external }[] }[]), `merchants` (string[]),
`merchantsLabel`, `backing` (ReactNode: the sky line, with a small logo inside), `backingLabel`, `logo` (default the
white lockup), `logoHref`, `logoLabel`, `description`, `wordmark` (string or null, default "AGENTCARD"), `bandFrom` (the
ground above, default white; null for none), plus footer props. Give it an `id` to let the nav dock step aside.

## Examples
Example components: npx agentcard-ds add site-footer
[Site](https://agentcard-ds.vercel.app/preview/site-footer/Site)

examples/site-footer.tsx

```tsx
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

```

## Source

components/site/site-footer.tsx

```tsx
import * as React from "react";

import { Lockup } from "@/components/ui/logo";
import { BandDivider, Scan, type BandGround } from "@/components/visuals/band-divider";
import { Marquee } from "@/components/visuals/marquee";
import { StripedWordmark } from "@/components/visuals/striped-wordmark";
import { cn } from "@/lib/utils";

// The blue footer (agentcard.sh, footer.v7-foot): the stepped band in from the ground above, then on the blue the brand
// block at the top left (the backing line in sky, the lockup in white, a two-line description in 14px) and the sitemap
// at the top right (columns in the 12px display face, sky headings, white links 8px apart), the running line of
// merchants between two rules, and the striped wordmark across the full width, standing on the bottom edge. A sheet of
// scanlines and a vignette lies over all of it. Under 900px the brand block and the sitemap stack.
type FooterLink = { label: React.ReactNode; href: string; external?: boolean };
type FooterGroup = { title: React.ReactNode; links: FooterLink[] };

type SiteFooterProps = Omit<React.ComponentProps<"footer">, "children"> & {
  /** The sitemap's columns. */
  groups: FooterGroup[];
  /** Names on the running line (merchants, customers). Omit for no line. */
  merchants?: string[];
  /** What a screen reader hears for the running line. */
  merchantsLabel?: string;
  /** The backing line over the lockup, e.g. <>Backed by <img alt="" className="size-[1.05em]" src={yc} /> Combinator</>. */
  backing?: React.ReactNode;
  /** The backing line's accessible text, when it holds a logo (e.g. "Backed by Y Combinator"). */
  backingLabel?: string;
  /** The logo, white. Defaults to the lockup. */
  logo?: React.ReactNode;
  logoHref?: string;
  logoLabel?: string;
  /** The line under the lockup (two short lines; break it with <br />). */
  description?: React.ReactNode;
  /** The giant striped word at the foot. null for none. */
  wordmark?: string | null;
  /** The ground above the footer, for the stepped band in. null for no band. */
  bandFrom?: BandGround | null;
};

function SiteFooter({
  groups,
  merchants,
  merchantsLabel,
  backing,
  backingLabel,
  logo,
  logoHref = "/",
  logoLabel = "Agentcard, home",
  description,
  wordmark = "AGENTCARD",
  bandFrom = "white",
  className,
  ...props
}: SiteFooterProps) {
  return (
    <>
      {bandFrom && <BandDivider from={bandFrom} to="blue" />}
      <footer data-slot="site-footer" data-ground="blue" className={cn("relative isolate overflow-clip bg-brand text-on-brand", className)} {...props}>
        <div className="relative z-1 flex items-start justify-between gap-10 px-[clamp(--spacing(7.5),5vw,--spacing(24))] pt-18 pb-52 max-[56.25rem]:flex-col max-[56.25rem]:gap-8 max-[56.25rem]:px-4.5 max-[56.25rem]:pt-10 max-[56.25rem]:pb-11">
          <div className="flex flex-col items-start gap-2.5 font-display text-caption leading-code max-[56.25rem]:self-stretch">
            {backing && (
              <div className="flex items-center gap-1.5 text-fg-on-brand-label [&_img]:size-[1.05em] [&_svg]:size-[1.05em]" aria-label={backingLabel} role={backingLabel ? "img" : undefined}>
                {backing}
              </div>
            )}
            <a href={logoHref} aria-label={logoLabel} className="rounded-chip">
              {logo ?? <Lockup label={null} tone="white" />}
            </a>
            {description && <p className="text-body-sm leading-body">{description}</p>}
          </div>
          <div className="grid w-[min(51.25rem,58vw)] auto-cols-[minmax(0,1fr)] grid-flow-col gap-x-[clamp(--spacing(5),2.2vw,--spacing(9))] gap-y-7 font-display text-caption leading-body max-[56.25rem]:mb-3 max-[56.25rem]:w-auto max-[56.25rem]:grid-flow-row max-[56.25rem]:grid-cols-[repeat(auto-fill,minmax(--spacing(37.5),1fr))] max-[56.25rem]:gap-x-6 max-[56.25rem]:self-stretch">
            {groups.map((group, i) => (
              <nav key={i} aria-label={typeof group.title === "string" ? group.title : undefined} className="flex flex-col items-start gap-2">
                <p className="mb-1 text-fg-on-brand-label">{group.title}</p>
                {group.links.map((link) => {
                  const external = link.external ?? /^https?:/.test(link.href);
                  return (
                    <a
                      key={link.href + String(link.label)}
                      href={link.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="rounded-chip underline-offset-3 hover:underline"
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>
            ))}
          </div>
        </div>
        {merchants && merchants.length > 0 && <Marquee items={merchants} label={merchantsLabel} className="relative z-1" />}
        {wordmark && <StripedWordmark text={wordmark} className="relative z-1" />}
        <Scan sides={false} className="z-5" />
      </footer>
    </>
  );
}

export { SiteFooter };
export type { FooterGroup, FooterLink, SiteFooterProps };

```
