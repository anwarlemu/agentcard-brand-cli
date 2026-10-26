# Section
Page section, section heading and optional label.

Install: npx agentcard-ds add section
Requires: theme, utils
Packages: none
Exports: SiteSection, SectionHeading, Eyebrow, SectionGround
Client boundary: not required by this entry file
Reference: agentcard-website src/app/globals.css:1520 (.v7-section), :1585 (.v7-heading-center), :1509 (.v7-eyebrow); agentcard.sh / and /about (computed)


## Usage
Use SiteSection for content layout, SectionHeading for the title and description, and Eyebrow for an optional label. Choose white, paper or blue backgrounds as needed.
- Avoid: Two blue sections in a row
- Avoid: Left-aligned section titles over centered content
- Avoid: Bold titles
- Avoid: Eyebrows in caps
- Avoid: A ground change without a band divider
`SiteSection` props: `ground` ("white" | "paper" | "blue"), `contained` (default true: the 1200px column),
`innerClassName`, plus section props. `SectionHeading` props: `title`, `description`, `eyebrow`, `as` ("h1" | "h2" |
"h3", default h2), `align` ("center" | "start"). `Eyebrow` takes paragraph props.

## Examples
Example components: npx agentcard-ds add section window
[Site](https://agentcard-ds.vercel.app/preview/section/Site)

examples/section.tsx

```tsx
import { Eyebrow, SectionHeading, SiteSection } from "@/components/site/section";
import { Window } from "@/components/ui/window";

function Placeholder({ name }: { name: string }) {
  return (
    <Window name={name} className="h-48" bodyClassName="flex items-center justify-center bg-sky-wash font-display text-caption text-fg-label">
      Content
    </Window>
  );
}

export function Site() {
  return (
    <>
      <SiteSection>
        <SectionHeading title="Powering payments for agentic startups" description="Consumer apps, B2B companies and crypto platforms use Agentcard to let their agents pay." />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Placeholder name="first.case" />
          <Placeholder name="second.case" />
          <Placeholder name="third.case" />
        </div>
      </SiteSection>
      <SiteSection ground="paper">
        <SectionHeading eyebrow="Products" title="Explore our products" description="Vault, Issuing, Voice and the Purchase Agent." />
      </SiteSection>
      <SiteSection ground="blue">
        <Eyebrow>On the blue</Eyebrow>
        <SectionHeading align="start" className="mt-2.5" title="A lit band" description="White text, sky labels." />
      </SiteSection>
    </>
  );
}

```

## Source

components/site/section.tsx

```tsx
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

```
