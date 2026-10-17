"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { useFieldControl } from "@/components/ui/field";
import { cn } from "@/lib/utils";

// Two fields. `field` is the get-started form's (agentcard.sh/get-started, .v7-gate-field input, computed): square, a
// 35 percent ink border, 18px Inter at 1.3 leading, 10px by 12px of padding, at least 44px tall; focus draws a 2px blue
// outline just inside the edge, at once (no transition); an invalid field's border is red. `search` is the guides'
// search box (agentcard-website src/app/globals.css .v7-guide-search): 36px, 8px corners, a 12 percent ink edge that
// darkens to 24 percent under the pointer (160ms ease-out), white with a faint inner shadow, 14px Inter, a 15px ink
// search mark 12px in with 10px to the text; focus is the 2px blue outline 2px out.
const inputVariants = cva(
  "flex w-full min-w-0 bg-surface text-fg outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        field:
          "min-h-11 rounded-none border border-line-strong px-3 py-2.5 font-sans text-h5 leading-snug placeholder:text-fg-faint focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring aria-invalid:border-danger file:border-0 file:bg-transparent file:font-display file:text-body-sm file:text-fg",
        search:
          "h-9 rounded-control border border-line-field pr-3 pl-9.25 font-sans text-body-sm shadow-inset transition-[border-color] duration-160 ease-out placeholder:text-fg-muted hover:border-line-field-hover focus-visible:outline-2 focus-visible:outline-solid motion-reduce:transition-none focus-visible:outline-offset-2 focus-visible:outline-focus-ring [&::-webkit-search-cancel-button]:hidden",
      },
    },
    defaultVariants: { variant: "field" },
  },
);

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 fill-none stroke-current text-fg [stroke-linecap:round] [stroke-width:1.5]">
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

function Input({ className, type, variant, ...props }: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  const input = <input type={variant === "search" ? (type ?? "search") : type} data-slot="input" className={cn(inputVariants({ variant }), variant !== "search" && className)} {...useFieldControl(props)} />;
  if (variant !== "search") return input;
  return (
    <div data-slot="search" className={cn("relative w-full", className)}>
      <SearchIcon />
      {input}
    </div>
  );
}

export { Input, inputVariants };
