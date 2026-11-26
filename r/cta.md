# CTA
Blue section with a heading, action and optional media.

Install: npx agentcard-ds add cta
Requires: theme, band-divider, utils
Packages: none
Exports: Cta, CtaProps
Client boundary: not required by this entry file
Reference: Extension from agentcard-website src/app/globals.css:1288 (.cta, an earlier closing stage); built from the hero's ground and the band divider (agentcard.sh has no closing CTA)


## Usage
Use near the end of a page when another action is needed. Provide a working link or handler for the action.
- Avoid: More than one per page
- Avoid: Two keys of equal weight
- Avoid: A blue key on the blue
- Avoid: A gradient or glow behind the headline
- Avoid: Long copy
`Cta` props: `title`, `description`, `actions` (the on-brand Button), `media`, `bandFrom` and `bandTo` (default white;
null for none), `scan` (default true), plus section props.

## Examples
Example components: npx agentcard-ds add cta button window
[Site](https://agentcard-ds.vercel.app/preview/cta/Site) | [WithMedia](https://agentcard-ds.vercel.app/preview/cta/WithMedia)

examples/cta.tsx

```tsx
import { Cta } from "@/components/site/cta";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/window";

export function Site() {
  return (
    <div className="bg-surface py-16">
      <Cta
        title="Let your agent buy"
        description="Issue a card in minutes and set the limits it spends under."
        actions={
          <Button asChild variant="on-brand">
            <a href="https://app.agentcard.sh/">Get started</a>
          </Button>
        }
      />
    </div>
  );
}

export function WithMedia() {
  return (
    <Cta
      bandFrom="paper"
      bandTo="paper"
      title="Let your agent buy"
      actions={
        <Button asChild variant="on-brand">
          <a href="https://app.agentcard.sh/">Get started</a>
        </Button>
      }
      media={
        <Window name="agent.request" className="mx-auto h-56 max-w-160 text-left shadow-code" bodyClassName="flex items-center justify-center bg-sky-wash font-display text-caption text-fg-label">
          Imagery
        </Window>
      }
    />
  );
}

```

## Source

components/site/cta.tsx

```tsx
import * as React from "react";

import { BandDivider, Scan, type BandGround } from "@/components/visuals/band-divider";
import { cn } from "@/lib/utils";

// A closing band on the blue. The live agentcard.sh has no closing call to action (its FAQ runs straight into the
// footer), so this is the simplest band true to the system: the stepped bands in and out, the blue ground under the
// scanlines the hero and the footer wear, a centered 52px display headline (34px on phones), one 19px line in white at
// 72 percent, the white key, and room for imagery under it.
type CtaProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: React.ReactNode;
  /** One line under the headline. */
  description?: React.ReactNode;
  /** The key: the on-brand Button (one main action, a quiet second at most). */
  actions?: React.ReactNode;
  /** Imagery under the actions (a window, a product shot). */
  media?: React.ReactNode;
  /** The grounds above and below, for the stepped bands. null for no band. */
  bandFrom?: BandGround | null;
  bandTo?: BandGround | null;
  scan?: boolean;
};

function Cta({ title, description, actions, media, bandFrom = "white", bandTo = "white", scan = true, className, ...props }: CtaProps) {
  return (
    <div data-slot="cta">
      {bandFrom && <BandDivider from={bandFrom} to="blue" />}
      <section data-ground="blue" className={cn("relative isolate overflow-hidden bg-brand px-(--ds-layout-gutter) pt-16 pb-20 text-center text-on-brand md:pt-28 md:pb-32", className)} {...props}>
        {scan && <Scan className="-z-10" />}
        <div className="mx-auto flex max-w-(--ds-layout-column) flex-col items-center">
          <h2 className="max-w-[18ch] font-display text-h1 leading-heading font-medium tracking-tighter text-balance text-white">{title}</h2>
          {description && <p className="mt-5 max-w-(--ds-layout-heading) text-body-lg leading-snug text-pretty text-fg-on-brand-muted">{description}</p>}
          {actions && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
          {media && <div className="mt-14 w-full">{media}</div>}
        </div>
      </section>
      {bandTo && <BandDivider from="blue" to={bandTo} />}
    </div>
  );
}

export { Cta };
export type { CtaProps };

```
