"use client";

import * as React from "react";

import { WindowBar } from "@/components/ui/window";
import { TRAIL_REST, useTrail } from "@/hooks/use-trail";
import { cn } from "@/lib/utils";

// The customer cases (agentcard.sh home, "Powering payments for agentic startups"; .v7-cases, .v7-case): each case is a
// window hung on the trail, at its own height and tilt, one thin ink line threaded through their centres. A window is
// the sky bar (orchid.case) over a blue frame, a white card inset 10px in it: a large blue opening quote, the context in
// small muted text, the quote at 24px, a dotted rule, then the company's logo and name and a blue tag at the right.
// On a phone the windows stack, still tilted and on their line, their drops scaled down.

type Case = {
  name: string;
  /** The company's mark, about 20px (an svg or img, decorative: the name is beside it). */
  logo?: React.ReactNode;
  /** The quote itself, set large. The closing mark is part of your text. */
  quote: React.ReactNode;
  /** The sentence before the quote, in small muted text ("Consumer apps like Orchid buy on Amazon:"). */
  context?: React.ReactNode;
  /** The kind of company, in blue at the right (Consumer, B2B, Crypto). */
  tag?: React.ReactNode;
  /** The bar's name; defaults to the company's slug with .case. */
  file?: string;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function CaseWindow({ item, index }: { item: Case; index: number }) {
  const rest = TRAIL_REST[index % TRAIL_REST.length];
  return (
    <li
      data-trail-card=""
      style={{ "--trail-y": `${rest.y}px`, "--trail-rot": `${rest.rot}deg` } as React.CSSProperties}
      className="relative z-10 flex flex-col overflow-hidden rounded-card border border-hairline bg-brand shadow-card [transform:translateY(calc(var(--trail-y)*0.45))_rotate(var(--trail-rot))] lg:[transform:translateY(var(--trail-y))_rotate(var(--trail-rot))]"
    >
      {/* The frame: the blue ground with a band of sky washing through its lower half, as the brand's moving grain does. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--ds-color-brand)_36%,color-mix(in_srgb,var(--ds-color-sky)_78%,var(--ds-color-brand))_63%,var(--ds-color-brand)_90%)]"
      />
      <WindowBar name={item.file ?? `${slug(item.name)}.case`} className="relative shadow-[inset_0_1px_0_color-mix(in_srgb,var(--ds-color-white)_35%,transparent)]" />
      <figure className="relative m-2.5 flex flex-1 flex-col rounded-[calc(var(--ds-radius-card)-0.125rem)] border border-[color-mix(in_srgb,var(--ds-color-ink)_18%,transparent)] bg-surface px-6 pt-6.5 pb-7.5 text-fg shadow-[0_2px_8px_-2px_color-mix(in_srgb,var(--ds-color-ink)_30%,transparent)] max-md:px-5 max-md:pt-5.5 max-md:pb-6">
        <span aria-hidden className="relative -top-[0.06em] -left-[0.05em] block h-[0.36em] font-display text-display leading-none font-normal text-fg-brand">
          “
        </span>
        <blockquote className="mt-3.5 flex-1">
          {item.context && <p className="text-body-sm leading-5.5 opacity-72 text-pretty">{item.context}</p>}
          <p className={cn("text-h3 [line-height:1.2] font-medium [letter-spacing:-0.03em] text-balance", item.context && "mt-2")}>{item.quote}</p>
        </blockquote>
        <figcaption className="mt-5.5 flex items-center gap-2 border-t-2 border-dotted border-line-mid pt-4 text-body-sm">
          {item.logo && (
            <span aria-hidden className="flex size-5 flex-none items-center justify-center [&>img]:size-full [&>svg]:size-full">
              {item.logo}
            </span>
          )}
          <span className="font-medium tracking-tight">{item.name}</span>
          {item.tag && <span className="ml-auto text-caption text-fg-brand">{item.tag}</span>}
        </figcaption>
      </figure>
    </li>
  );
}

/** The customer cases hung on the trail: three to a row on wide screens, stacked on a phone. */
function Testimonials({ cases, className, ...props }: React.ComponentProps<"div"> & { cases: Case[] }) {
  const root = React.useRef<HTMLDivElement>(null);
  const path = React.useRef<SVGPathElement>(null);
  useTrail(root, path, cases.length);
  return (
    <div ref={root} data-slot="testimonials" className={cn("relative pb-9 lg:pt-10", className)} {...props}>
      <svg aria-hidden preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <path ref={path} className="fill-none stroke-fg [stroke-linecap:round] [stroke-width:1.5] [vector-effect:non-scaling-stroke]" />
      </svg>
      <ul className="mx-auto mt-2 grid max-w-[min(35rem,80vw)] grid-cols-1 gap-y-18 lg:mt-14 lg:max-w-none lg:grid-cols-3 lg:items-start lg:gap-6">
        {cases.map((item, i) => (
          <CaseWindow key={item.name} item={item} index={i} />
        ))}
      </ul>
    </div>
  );
}

export { Testimonials, type Case };
