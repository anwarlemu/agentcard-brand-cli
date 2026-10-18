"use client";

import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

// The brand's toast (agentcard-website globals.css, .v7-toast, GuideToaster in guide-client.tsx): the site's white card
// at the bottom left, one 40px line high, a 16 percent ink hairline and 8px corners; a 24px blue key with a white tick
// at its left, then the title (the 14px display face at 500) and its line (12px, 68 percent ink) side by side. An
// action is a small blue key at the right, cancel a small white one. Sonner places, stacks and swipes it (its own
// enter and exit motion); this only draws it.
const KEY = "grid size-6 shrink-0 place-items-center rounded-sm border text-on-primary [&_svg]:size-3 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:2]";

function Mark({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const TICK = "M3.5 8.5 6.5 11.5 12.5 4.5";

function Toaster({ toastOptions, ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="bottom-left"
      offset={{ left: 30, bottom: 20 }}
      mobileOffset={{ left: 18, bottom: 20 }}
      visibleToasts={3}
      icons={{
        success: <Mark d={TICK} />,
        info: <Mark d="M8 7v5M8 4.5v.01" />,
        warning: <Mark d="M8 4v5M8 11.5v.01" />,
        error: <Mark d="M4.5 4.5l7 7M11.5 4.5l-7 7" />,
      }}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          toast:
            "flex h-10 w-max max-w-[calc(100vw-2.25rem)] items-center gap-2.5 rounded-control border border-hairline bg-surface pr-1.5 pl-1.75 font-sans text-fg shadow-[inset_0_1px_0_var(--ds-color-white),inset_0_-1px_0_color-mix(in_srgb,var(--ds-color-ink)_5%,transparent),0_2px_4px_color-mix(in_srgb,var(--ds-color-ink)_8%,transparent),0_12px_24px_-12px_color-mix(in_srgb,var(--ds-color-ink)_30%,transparent)] [&:not(:has([data-button]))]:pr-3.5",
          icon: cn(KEY, "m-0 border-line-brand-edge bg-primary shadow-key-brand"),
          content: "flex min-w-0 items-baseline gap-2",
          title: "font-display text-body-sm leading-snug font-medium whitespace-nowrap",
          description: "max-w-55 truncate font-display text-caption [line-height:1.4] text-fg-muted",
          actionButton:
            "ml-1.5 h-7 shrink-0 cursor-pointer rounded-sm border border-line-brand-edge bg-primary px-2.5 font-display text-caption text-on-primary shadow-key-brand outline-none transition-[background-color,box-shadow,translate] duration-150 ease-out hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed motion-reduce:transition-none",
          cancelButton:
            "ml-1.5 h-7 shrink-0 cursor-pointer rounded-sm border border-hairline bg-surface px-2.5 font-display text-caption text-fg shadow-key outline-none transition-[background-color,box-shadow,translate] duration-150 ease-out hover:bg-sky-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed motion-reduce:transition-none",
          error: "[&_[data-icon]]:border-danger [&_[data-icon]]:bg-danger",
          warning: "[&_[data-icon]]:border-warning [&_[data-icon]]:bg-warning",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
