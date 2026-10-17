import * as React from "react";

import { cn } from "@/lib/utils";

// A band of the page (agentcard.sh, .v7-section): 80px above and 110px below on a desktop, 50px and 65px on a phone,
// content on the 1200px column with 40px gutters (20px on phones). White is the default ground; paper is the warm page;
// blue is a lit band (white text, sky labels). Seams between grounds are the band divider's job, not the section's.
const GROUNDS = {
  white: "bg-surface text-fg",
  paper: "bg-paper text-fg",
  blue: "bg-brand text-on-brand",
} as const;

type SectionGround = keyof typeof GROUNDS;

function SiteSection({
  ground = "white",
  contained = true,
  className,
  innerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  ground?: SectionGround;
  /** Hold the content to the 1200px column. Off for a band whose content runs edge to edge. */
  contained?: boolean;
  innerClassName?: string;
}) {
  return (
    <section data-slot="site-section" data-ground={ground} className={cn("relative pt-12.5 pb-16.25 md:pt-20 md:pb-27.5", GROUNDS[ground], className)} {...props}>
      {contained ? <div className={cn("mx-auto w-(--ds-frame-column)", innerClassName)}>{children}</div> : children}
    </section>
  );
}

/** A small label in the display face: blue on white, sky on the blue. Sentence case, never caps. */
function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="eyebrow" className={cn("font-display text-caption leading-4.5 tracking-label text-fg-label in-data-[ground=blue]:text-fg-on-brand-label", className)} {...props} />;
}

/**
 * A section's opening: the centered 36px title (28px on phones), and its 19px description 14px below at 70 percent of
 * the text color. An eyebrow, when given, sits 10px above the title.
 */
function SectionHeading({
  title,
  description,
  eyebrow,
  as: Heading = "h2",
  align = "center",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "center" | "start";
}) {
  const centered = align === "center";
  return (
    <div data-slot="section-heading" className={cn(centered ? "text-center" : "text-left", className)} {...props}>
      {eyebrow && <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>}
      <Heading className="font-display text-h2 leading-7.5 font-medium tracking-tighter text-balance md:leading-9.75">{title}</Heading>
      {description && (
        <p className={cn("mt-3.5 max-w-(--ds-layout-heading) text-body-lg leading-6.75 tracking-tight text-pretty opacity-70", centered && "mx-auto")}>{description}</p>
      )}
    </div>
  );
}

export { SiteSection, SectionHeading, Eyebrow };
export type { SectionGround };
