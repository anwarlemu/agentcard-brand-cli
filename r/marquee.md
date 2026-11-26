# Marquee
Scrolling row of names that pauses on hover and respects reduced motion.

Install: npx agentcard-ds add marquee
Requires: theme, utils
Packages: none
Exports: Marquee, MarqueeProps
Client boundary: yes
Reference: agentcard-website src/components/v7/site-footer.tsx (.v7-foot-line); src/app/globals.css:5073; agentcard.sh / (computed)


## Usage
Use for a merchant, customer or partner list. Use at most one per page.
- Avoid: Logos in color on the line
- Avoid: A fast loop (under 30s a lap)
- Avoid: Two running lines on one page
- Avoid: Text a reader must read to act
`Marquee` props: `items` (ReactNode[]), `label` (what a screen reader hears; defaults to the names joined), `separator`
(default ✳), `duration` (seconds a lap, default 48), `ground` ("blue" | "white", default blue).

## Examples
Example components: npx agentcard-ds add marquee surface
[Site](https://agentcard-ds.vercel.app/preview/marquee/Site)

examples/marquee.tsx

```tsx
import { Marquee } from "@/components/visuals/marquee";
import { Surface } from "@/lib/surface";

const MERCHANTS = ["Amazon", "Walmart", "Target", "Best Buy", "Home Depot", "Lowe’s", "Macy’s", "Wayfair", "Staples", "Kohl’s", "B&H Photo", "DoorDash", "Good Eggs", "Locale", "Flights"];

export function Site() {
  return (
    <div className="grid gap-6">
      <Surface ground="blue" className="overflow-hidden rounded-panel py-10">
        <Marquee items={MERCHANTS} label="Agents buy at Amazon, Walmart, Target and more." />
      </Surface>
      <div className="overflow-hidden rounded-panel border border-hairline py-10">
        <Marquee items={MERCHANTS} ground="white" duration={60} />
      </div>
    </div>
  );
}

```

## Source

components/visuals/marquee.tsx

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// The running line (agentcard.sh, .v7-foot-line): names in the display face, each followed by a small star, between two
// rules, sliding sideways forever. Two copies of the line sit end to end and the track moves by one copy's width, so the
// loop has no seam. It is linear and slow (48s a lap), stops under the pointer so a name can be read, and stands still
// with reduced motion. The moving line is hidden from screen readers; `label` says it once instead.
const GROUNDS = {
  blue: { line: "border-line-on-brand-strong", star: "text-fg-on-brand-label" },
  white: { line: "border-line-strong", star: "text-fg-label" },
} as const;

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

type MarqueeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The names on the line, in order. */
  items: React.ReactNode[];
  /** What a screen reader hears instead of the moving line. Defaults to the names joined, when they are text. */
  label?: string;
  /** The mark between names. */
  separator?: React.ReactNode;
  /** Seconds for one lap (one copy of the line). */
  duration?: number;
  /** The ground it sits on: white rules and sky stars on the blue, ink rules and blue stars on white. */
  ground?: keyof typeof GROUNDS;
};

function Marquee({ items, label, separator = "✳", duration = 48, ground = "blue", className, ...props }: MarqueeProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<Animation | null>(null);
  const reduce = useReducedMotion();
  const tone = GROUNDS[ground];
  const spoken = label ?? (items.every((item) => typeof item === "string") ? `${items.join(", ")}.` : undefined);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el || reduce || typeof el.animate !== "function") return;
    const animation = el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], { duration: duration * 1000, iterations: Infinity, easing: "linear" });
    animationRef.current = animation;
    return () => {
      animation.cancel();
      animationRef.current = null;
    };
  }, [reduce, duration]);

  const pause = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") animationRef.current?.pause();
  };
  const play = () => animationRef.current?.play();

  return (
    <div data-slot="marquee" className={cn("flex overflow-hidden border-y font-display text-caption leading-body", tone.line, className)} onPointerEnter={pause} onPointerLeave={play} {...props}>
      <div ref={trackRef} aria-hidden className="flex flex-none will-change-transform">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex-none py-3 whitespace-nowrap">
            {items.map((item, i) => (
              <span key={i}>
                {item}{" "}
                <i className={cn("mx-4.5 inline-block not-italic", tone.star)}>{separator}</i>
              </span>
            ))}
          </span>
        ))}
      </div>
      {spoken && <span className="sr-only">{spoken}</span>}
    </div>
  );
}

export { Marquee };
export type { MarqueeProps };

```
