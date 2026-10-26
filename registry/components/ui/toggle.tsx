"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A key that stays down (extrapolated from the brand's keys, the v7 bevel). `default` is the ghost key: a bare display
// label that washes on hover; on, it sinks into the pressed well (the pale wash, a hairline, the pressed shadow). `outline`
// is the white key with its bevel; on, it is pressed the same way. 8px corners, the 14px display face, a 14px glyph.
// Pressing nudges it down a pixel like every key; the state change itself is a color and shadow change only.
const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-control border font-display font-normal leading-none whitespace-nowrap outline-none select-none transition-[background-color,color,box-shadow,translate] duration-150 ease-out active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:text-danger motion-reduce:transition-none motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-transparent text-fg-muted hover:bg-wash-hover hover:text-fg data-[state=on]:border-hairline data-[state=on]:bg-subtle data-[state=on]:text-fg data-[state=on]:shadow-pressed",
        outline: "border-hairline bg-surface text-fg shadow-key hover:bg-sky-wash data-[state=on]:bg-subtle data-[state=on]:shadow-pressed",
      },
      size: {
        default: "h-10 min-w-10 px-3.5 text-body-sm",
        sm: "h-8 min-w-8 px-2.5 text-caption",
        lg: "h-11 min-w-11 px-4.5 text-body-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Toggle({ className, variant, size, ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size, className }))} {...props} />;
}

export { Toggle, toggleVariants };
