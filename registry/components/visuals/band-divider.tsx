"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// The seam between two grounds (agentcard.sh, .band-divider): four 9px steps, each a further mix from the ground above
// toward the ground below, a staircase rather than a gradient. A film grain lies over the steps: fractal noise with its
// color stripped, blended soft-light so it never tints them, oversized past the divider and jumped between offsets on
// a stepped loop, so each frame is a composite and not a repaint. The grain is the one thing on the page that moves on
// its own; it stills with reduced motion.
type Ground = "blue" | "white" | "paper" | "ink";

const GROUND: Record<Ground, string> = {
  blue: "var(--ds-color-brand)",
  white: "var(--ds-color-bg-default)",
  paper: "var(--ds-color-paper)",
  ink: "var(--ds-color-ink)",
};

const STEPS = ["--ds-band-mix-1", "--ds-band-mix-2", "--ds-band-mix-3", "--ds-band-mix-4"];

// The grain tile: per-pixel noise, desaturated to pure value (no color in it).
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>")`;

// The jumps, as on the brand's page: eight offsets held for one frame each over 640ms.
const JUMPS = [
  [0, 0],
  [-37, 21],
  [53, -45],
  [-61, -13],
  [29, 59],
  [-19, -67],
  [71, 7],
  [-47, 43],
  [0, 0],
];

/** The scanlines and vignette the blue grounds wear (the hero, the footer): ink lines every 3px, darker at the edges. */
function Scan({ sides = true, className }: { sides?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="scan"
      className={cn(
        "pointer-events-none absolute inset-0",
        sides
          ? "bg-[repeating-linear-gradient(0deg,color-mix(in_srgb,var(--ds-color-ink)_16%,transparent)_0_1px,transparent_1px_3px),radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--ds-color-ink)_38%,transparent)),linear-gradient(90deg,color-mix(in_srgb,var(--ds-color-ink)_34%,transparent),transparent_16%,transparent_84%,color-mix(in_srgb,var(--ds-color-ink)_34%,transparent))]"
          : "bg-[repeating-linear-gradient(0deg,color-mix(in_srgb,var(--ds-color-ink)_16%,transparent)_0_1px,transparent_1px_3px),radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--ds-color-ink)_38%,transparent))]",
        className,
      )}
    />
  );
}

function useReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduce;
}

function BandDivider({ from = "blue", to = "white", grain = true, className, style, ...props }: Omit<React.ComponentProps<"div">, "children"> & { from?: Ground; to?: Ground; grain?: boolean }) {
  const grainRef = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const el = grainRef.current;
    if (!el || reduce || typeof el.animate !== "function") return;
    const animation = el.animate(
      JUMPS.map(([x, y], i) => ({ transform: `translate(${x}px, ${y}px)`, offset: i / (JUMPS.length - 1), easing: "steps(1, end)" })),
      { duration: 640, iterations: Infinity },
    );
    return () => animation.cancel();
  }, [reduce, grain]);

  return (
    <div
      aria-hidden
      data-slot="band-divider"
      className={cn("pointer-events-none relative flex h-[calc(var(--ds-band-step)*4)] w-full flex-col overflow-hidden select-none", className)}
      style={{ backgroundColor: GROUND[to], ...style }}
      {...props}
    >
      {STEPS.map((step) => (
        <span key={step} className="min-h-0 flex-1" style={{ backgroundColor: `color-mix(in srgb, ${GROUND[to]} var(${step}), ${GROUND[from]})` }} />
      ))}
      {grain && (
        <span
          ref={grainRef}
          className="absolute -inset-22.5 opacity-85 mix-blend-soft-light will-change-transform [image-rendering:pixelated]"
          style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
        />
      )}
    </div>
  );
}

export { BandDivider, Scan };
export type { Ground as BandGround };
