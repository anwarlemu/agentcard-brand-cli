import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A short label (agentcard.sh). `tag` is the brand's small caps tag, as on the updates page (.v7-upd-tag): the 10px
// display face in caps, tracked wide, blue on a 1px blue border with square corners (the only caps the brand sets).
// The status badges are a small white box in the 12px display face, sentence case, told apart by a dot and the color
// of their text: ink, blue, green, amber or red. `chip` is a quiet rounded label on a pale wash, for counts and filters.
const STATUS = "h-6 gap-1.5 rounded-sm border border-hairline bg-surface px-2 font-display text-caption leading-none before:size-1.5 before:shrink-0 before:rounded-pill before:bg-current";

const badgeVariants = cva("inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3", {
  variants: {
    variant: {
      default: `${STATUS} text-fg-muted`,
      brand: `${STATUS} border-line-window bg-blue-5 text-fg-brand`,
      success: `${STATUS} text-success`,
      warning: `${STATUS} text-warning`,
      destructive: `${STATUS} text-danger`,
      tag: "rounded-none border border-line-brand px-2 pt-1.25 pb-1 font-display text-micro leading-snug tracking-caps text-fg-brand uppercase",
      chip: "h-6 rounded-sm bg-wash-pill px-2 font-display text-caption leading-none text-fg-secondary",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({ className, variant, asChild = false, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
