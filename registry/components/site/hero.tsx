import * as React from "react";

import { BandDivider, Scan, type BandGround } from "@/components/visuals/band-divider";
import { cn } from "@/lib/utils";

// The blue hero (agentcard.sh, section.v7-immersive): full bleed, the first screen tall (at least 660px, 730px on
// phones), the electric blue under a sheet of scanlines and a vignette, the site's imagery behind (`background`: its 3D
// objects, a scene), and the 72px display title in white at the middle, tracked -0.055em on leading 1. Under it an
// optional 19px line in white at 72 percent and the actions (the white key). The stepped band walks it into the page
// below. On the brand's page the title floats in 3D among the objects; `tilt` sets it in CSS perspective the same way.
// The section carries data-ds-hero, the CLI's mark for the home hero.

type HeroProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: React.ReactNode;
  /** Override title sizing and wrapping for shorter headlines. */
  titleClassName?: string;
  eyebrow?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** The keys under the title: the on-brand Button (one main action). */
  actions?: React.ReactNode;
  /** Imagery in the flow under the actions (a product shot, a window). */
  media?: React.ReactNode;
  /** Imagery behind everything, full bleed (3D objects, a scene, a video). Decorative: give it alt="" or aria-hidden. */
  background?: React.ReactNode;
  /** The site header, laid over the top of the hero. */
  header?: React.ReactNode;
  /** Set the title in perspective, tilted like the 3D title on the brand's home page. */
  tilt?: boolean;
  /** The scanlines and vignette over the blue. */
  scan?: boolean;
  /** The ground below the hero, for the stepped band; null for no band. */
  bandTo?: BandGround | null;
  /** Fill the first screen. Off for a shorter blue opening on an inner page. */
  fullScreen?: boolean;
};

function Hero({
  title,
  titleClassName,
  eyebrow,
  subtitle,
  actions,
  media,
  background,
  header,
  tilt = false,
  scan = true,
  bandTo = "white",
  fullScreen = true,
  className,
  style,
  ...props
}: HeroProps) {
  return (
    <div data-slot="hero" className="relative">
      <section
        data-ds-hero=""
        className={cn(
          "relative isolate flex flex-col items-center justify-center overflow-x-clip bg-brand px-(--ds-layout-gutter) text-center text-on-brand",
          fullScreen ? "min-h-182.5 py-28 md:min-h-165 md:py-32 h-svh" : "pt-37.5 pb-24",
          className,
        )}
        // The CLI's stylesheet draws its own band under [data-ds-hero]; this hero draws the band itself, so it zeroes
        // the step there (the band below is a sibling, so it keeps the step).
        style={{ "--ds-band-step": "0px", ...style } as React.CSSProperties}
        {...props}
      >
        {background && <div className="absolute inset-0 -z-20 overflow-hidden">{background}</div>}
        {scan && <Scan className="-z-10" />}
        {header}
        <div className="relative flex max-w-(--ds-layout-column) flex-col items-center">
          {eyebrow && <p className="mb-5 font-display text-caption leading-4.5 tracking-label text-fg-on-brand-label">{eyebrow}</p>}
          <div className={cn(tilt && "[perspective:62.5rem] [perspective-origin:50%_40%]")}>
            <h1
              className={cn(
                "max-w-[14ch] font-display text-hero leading-tight font-medium tracking-display text-balance text-white",
                tilt &&
                  "[transform:rotateY(30deg)_rotateX(14deg)_rotateZ(-19deg)_scale(1.25)] [text-shadow:0_1px_0_var(--ds-color-blue-mid),0_2px_0_var(--ds-color-blue-mid),0_3px_0_var(--ds-color-blue-mid),0_4px_0_var(--ds-color-blue-mid),0_5px_0_var(--ds-color-blue-edge)] [transform-style:preserve-3d]",
                titleClassName,
              )}
            >
              {title}
            </h1>
          </div>
          {subtitle && <p className="mt-6 max-w-(--ds-layout-heading) text-body-lg leading-snug text-pretty text-fg-on-brand-muted">{subtitle}</p>}
          {actions && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
          {media && <div className="mt-14 w-full">{media}</div>}
        </div>
      </section>
      {bandTo && <BandDivider from="blue" to={bandTo} />}
    </div>
  );
}

export { Hero };
export type { HeroProps };
