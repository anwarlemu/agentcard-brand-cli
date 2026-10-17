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
