"use client";

import * as React from "react";

import { WindowMark } from "@/components/ui/window";
import { TRAIL_REST, useTrail } from "@/hooks/use-trail";
import { cn } from "@/lib/utils";

// Who runs on the product (agentcard.sh home, "Working with Agentcard"; .v7-customer): each customer in a small window,
// its 26px bar in one pale tint (sage, sky, rose, teal, peach, butter in turn) brightening to white in the middle, the
// company's mark and name centred in the body. On wide screens the windows hang on the trail, four to a row, at their
// own heights and tilts, one thread snaking through every row. Four or fewer make one row at the same size, centred. On
// a phone they stand still, two to a row, with no line.

type Tone = "sage" | "sky" | "rose" | "teal" | "peach" | "butter";

type Customer = {
  name: string;
  /** The company's mark, about 24px (decorative: the name is beside it). */
  logo?: React.ReactNode;
  /** The bar's tint; by default the tints take turns. */
  tone?: Tone;
};

const TONES: Tone[] = ["sage", "sky", "rose", "teal", "peach", "butter"];
const TINT: Record<Tone, string> = {
  sage: "var(--ds-color-tint-sage)",
  sky: "var(--ds-color-sky)",
  rose: "var(--ds-color-tint-rose)",
  teal: "var(--ds-color-tint-teal)",
  peach: "var(--ds-color-tint-peach)",
  butter: "var(--ds-color-tint-butter)",
};

function CustomerWindow({ customer, index }: { customer: Customer; index: number }) {
  const rest = TRAIL_REST[index % TRAIL_REST.length];
  const tone = customer.tone ?? TONES[index % TONES.length];
  return (
    <li
      data-trail-card=""
      style={{ "--trail-y": `${rest.y}px`, "--trail-rot": `${rest.rot}deg`, "--tint": TINT[tone] } as React.CSSProperties}
      className="relative z-10 flex flex-col overflow-hidden rounded-[calc(var(--ds-radius-card)-0.125rem)] border border-line-mid bg-surface text-fg shadow-tile lg:[transform:translateY(var(--trail-y))_rotate(var(--trail-rot))]"
    >
      <div
        aria-hidden
        className="flex h-6.5 shrink-0 items-center justify-between border-b border-line bg-[linear-gradient(90deg,var(--tint),color-mix(in_srgb,var(--tint)_55%,var(--ds-color-white))_50%,var(--tint))] px-2.5 font-display text-micro leading-none text-fg"
      >
        <span className="tracking-mark opacity-45">↳</span>
        <WindowMark className="opacity-45" />
      </div>
      <div className="flex h-16 items-center justify-center gap-2.5 px-4 text-body-sm font-medium tracking-tight md:h-21 md:text-body">
        {customer.logo && (
          <span aria-hidden className="flex size-6 flex-none items-center justify-center [&>img]:size-full [&>svg]:size-full">
            {customer.logo}
          </span>
        )}
        <span className="min-w-0 text-center leading-snug">{customer.name}</span>
      </div>
    </li>
  );
}

/** The customers' windows: on the trail in rows of four on wide screens, two to a row on a phone. */
function LogoStrip({ customers, className, ...props }: React.ComponentProps<"div"> & { customers: Customer[] }) {
  const root = React.useRef<HTMLDivElement>(null);
  const path = React.useRef<SVGPathElement>(null);
  useTrail(root, path, customers.length);
  // Four or fewer: one row, each window the width it has in a row of four.
  const cols = Math.min(4, customers.length);
  return (
    <div
      ref={root}
      data-slot="logo-strip"
      style={{ "--cols": cols } as React.CSSProperties}
      className={cn("relative lg:pt-10 lg:pb-9", className)}
      {...props}
    >
      <svg aria-hidden preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block">
        <path ref={path} className="fill-none stroke-fg [stroke-linecap:round] [stroke-width:1.5] [vector-effect:non-scaling-stroke]" />
      </svg>
      <ul className="mx-auto mt-6 grid grid-cols-2 gap-x-4 gap-y-3.5 lg:max-w-[calc(var(--cols)*16.5rem+(var(--cols)-1)*3rem)] lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-x-12 lg:gap-y-25">
        {customers.map((customer, i) => (
          <CustomerWindow key={customer.name} customer={customer} index={i} />
        ))}
      </ul>
    </div>
  );
}

export { LogoStrip, type Customer };
