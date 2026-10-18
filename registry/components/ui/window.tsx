import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A card with a title bar, as the brand draws its plans, cases, directories and FAQ (agentcard.sh, .v7-windowbar):
// a 32px bar with an arrow, a file-like name and the [*] mark, over a white body with 12px corners and the soft drop.
// The bar is sky with blue marks; `blue` is the featured window's bar, white marks on the blue. The tints are the
// customer windows on the home page (.v7-customer): a shorter 26px bar in one pale hue, lit across its middle, over a 14
// percent ink rule, ink marks at 45 percent; the window itself 10px corners, a 22 percent ink edge and the tile's soft
// drop.
const windowBarVariants = cva(
  "flex h-8 shrink-0 items-center justify-between gap-3 border-b px-2.5 font-display text-micro leading-body",
  {
    variants: {
      tone: {
        sky: "border-line-window bg-window-bar text-window-bar-fg",
        blue: "border-line-brand-edge bg-brand text-on-brand",
        sage: "h-6.5 border-line bg-linear-to-r from-tint-sage via-[color-mix(in_srgb,var(--ds-color-tint-sage)_55%,var(--ds-color-white))] to-tint-sage text-fg",
        rose: "h-6.5 border-line bg-linear-to-r from-tint-rose via-[color-mix(in_srgb,var(--ds-color-tint-rose)_55%,var(--ds-color-white))] to-tint-rose text-fg",
        teal: "h-6.5 border-line bg-linear-to-r from-tint-teal via-[color-mix(in_srgb,var(--ds-color-tint-teal)_55%,var(--ds-color-white))] to-tint-teal text-fg",
        peach: "h-6.5 border-line bg-linear-to-r from-tint-peach via-[color-mix(in_srgb,var(--ds-color-tint-peach)_55%,var(--ds-color-white))] to-tint-peach text-fg",
        butter: "h-6.5 border-line bg-linear-to-r from-tint-butter via-[color-mix(in_srgb,var(--ds-color-tint-butter)_55%,var(--ds-color-white))] to-tint-butter text-fg",
      },
    },
    defaultVariants: { tone: "sky" },
  },
);

type Tone = NonNullable<VariantProps<typeof windowBarVariants>["tone"]>;
const TINTS: Tone[] = ["sage", "rose", "teal", "peach", "butter"];

/** The [*] mark at the right of a window bar: an asterisk drawn in three strokes between brackets. */
function WindowMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex items-center gap-px leading-none", className)}>
      [
      <svg viewBox="0 0 12 12" className="size-[0.8em] fill-none stroke-current [stroke-linecap:square] [stroke-width:1.6]">
        <path d="M6 .5v11M1.24 3.25l9.52 5.5M1.24 8.75l9.52-5.5" />
      </svg>
      ]
    </span>
  );
}

function WindowBar({ name, tone, actions, className, ...props }: Omit<React.ComponentProps<"div">, "children"> & { name: React.ReactNode; tone?: Tone; actions?: React.ReactNode }) {
  return (
    <div data-slot="window-bar" className={cn(windowBarVariants({ tone }), className)} {...props}>
      <span aria-hidden className="tracking-mark opacity-45">
        ↳
      </span>
      <span className="min-w-0 truncate">{name}</span>
      {actions ?? <WindowMark className={tone && TINTS.includes(tone) ? "opacity-45" : undefined} />}
    </div>
  );
}

/**
 * A window: the bar, then its body. `name` is the bar's label (pricing.plan, team.dir); `tone` its color. `raised`
 * adds the plan window's hard offset shadow (6px at 22 percent ink, as on /pricing and /about).
 */
function Window({ name, tone, actions, raised = false, className, bodyClassName, children, ...props }: React.ComponentProps<"div"> & { name: React.ReactNode; tone?: Tone; actions?: React.ReactNode; raised?: boolean; bodyClassName?: string }) {
  return (
    <div
      data-slot="window"
      className={cn(
        "flex flex-col overflow-hidden rounded-card border border-hairline bg-surface text-fg",
        raised ? "shadow-plan" : "shadow-card",
        tone && TINTS.includes(tone) && "rounded-[calc(var(--ds-radius-sm)+var(--ds-space-1))] border-line-mid",
        tone && TINTS.includes(tone) && !raised && "shadow-tile",
        className,
      )}
      {...props}
    >
      <WindowBar name={name} tone={tone} actions={actions} />
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}

export { Window, WindowBar, WindowMark, windowBarVariants };
