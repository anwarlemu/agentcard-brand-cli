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
