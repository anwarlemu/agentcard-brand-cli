import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A marker in a conversation or a feed, as the updates page dates its entries (agentcard.sh/updates): the 12px display
// face at 62 percent ink. `separator` centers it between two ink hairlines ("Yesterday"), `border` rules it underneath,
// and `unread` is the blue line where new messages begin.
const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left font-display text-caption leading-snug text-fg-subtle [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [a]:underline [a]:underline-offset-4 [a]:hover:text-fg",
  {
    variants: {
      variant: {
        default: "",
        separator: "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-line after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-line",
        border: "border-b border-line pb-2",
        unread: "text-fg-brand before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-line-brand after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-line-brand",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Marker({ className, variant = "default", asChild = false, ...props }: React.ComponentProps<"div"> & VariantProps<typeof markerVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return <Comp data-slot="marker" data-variant={variant} role={variant === "default" ? undefined : "separator"} className={cn(markerVariants({ variant }), className)} {...props} />;
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="marker-icon" aria-hidden="true" className={cn("inline-flex size-3.5 shrink-0 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5", className)} {...props} />;
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="marker-content" className={cn("min-w-0 break-words group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center group-data-[variant=unread]/marker:flex-none *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-fg", className)} {...props} />;
}

export { Marker, MarkerContent, MarkerIcon, markerVariants };
