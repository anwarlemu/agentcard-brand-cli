"use client";

import * as React from "react";

import { useTabGlide } from "@/hooks/use-tab-glide";
import { cn } from "@/lib/utils";

// The brand's tab track (.plan-tabs on /pricing; `sm` is the guides' .v7-guide-tablist) used as a value picker (a billing period, a card type): the sunken track and the gliding blue key
// of Tabs, each option sized to its label, with radio semantics. `plain` drops the track for dense rows: quiet labels with
// a pale wash gliding between them.
type Option<T extends string> = { value: T; label: React.ReactNode; count?: number; disabled?: boolean };
type Variant = "default" | "plain";

const KEY: Record<Variant, string> = {
  default: "rounded-control border border-line-brand-edge bg-primary shadow-key-brand",
  plain: "rounded-sm bg-wash-pill",
};

function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  label,
  size = "md",
  variant = "default",
  className,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: Option<T>[];
  label: string;
  size?: "sm" | "md";
  variant?: Variant;
  className?: string;
}) {
  const keyRef = React.useRef<HTMLSpanElement>(null);
  const isPlaced = useTabGlide(keyRef, value);
  const enabled = options.filter((option) => !option.disabled);
  const tabStop = enabled.find((option) => option.value === value)?.value ?? enabled[0]?.value;
  const track = variant === "default";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-slot="segmented-control"
      className={cn("relative isolate inline-flex w-fit items-center", track ? "gap-1 rounded-card border border-hairline bg-subtle p-1 shadow-well" : "gap-0.5",
        // The small track (the guides' .v7-guide-tablist): 10px corners round 6px keys.
        track && size === "sm" && "rounded-[calc(var(--ds-radius-sm)+var(--ds-space-1))]", className)}
    >
      {/* The hook measures from the outer edge; -1px puts the key back inside the track's border. */}
      <span ref={keyRef} aria-hidden className={cn("pointer-events-none absolute -z-10", track ? "-top-px -left-px" : "top-0 left-0", KEY[variant], track && size === "sm" && "rounded-sm", !isPlaced && "invisible")} />
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            data-tab-id={o.value}
            disabled={o.disabled}
            tabIndex={o.value === tabStop ? 0 : -1}
            onClick={() => onValueChange(o.value)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) || !enabled.length) return;
              event.preventDefault();
              const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
              const forward = event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
              const index = enabled.findIndex((option) => option.value === o.value);
              const next = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + (forward ? 1 : -1) + enabled.length) % enabled.length;
              const target = enabled[next].value;
              onValueChange(target);
              const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
              Array.from(buttons ?? []).find((button) => button.dataset.tabId === target)?.focus();
            }}
            className={cn(
              "disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 border border-transparent font-display leading-none whitespace-nowrap outline-none transition-[background-color,color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring motion-reduce:transition-none",
              track && size === "md" ? "rounded-control" : "rounded-sm",
              size === "sm" ? (track ? "h-7.5 px-3 text-caption" : "h-7 px-2.5 text-caption") : track ? "h-10 px-4 text-body-sm leading-body" : "h-8 px-3 text-body-sm",
              // Only the label and a faint wash answer the pointer, so nothing fades over the key gliding in beneath.
              selected ? (track ? "text-on-primary" : "text-fg") : cn("text-fg-muted hover:text-fg", track && "hover:bg-wash-pill"),
              // Until the key lands, the selected option draws it itself so the first paint matches.
              selected && !isPlaced && cn(KEY[variant], track && size === "sm" && "rounded-sm"),
            )}
          >
            {o.label}
            {o.count !== undefined && <span className={cn("tabular-nums", selected && track ? "text-fg-on-brand-muted" : "text-fg-subtle")}>{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
