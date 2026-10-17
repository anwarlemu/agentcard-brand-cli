import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A short label (agentcard.sh). `tag` is the brand's small caps tag on the updates page (/updates, .v7-upd-tag): the 10px
// display face in caps tracked 0.14em at 1.75 leading, 3px 8px 2px of padding, square corners and a 1px border in the
// text's own color: blue for something added (`tag`), ink for something improved (`tag-ink`), the heart red for a fix
// (`tag-heart`). Those are the only caps the brand sets. The status badges have no counterpart on the site; they are
// drawn from the white key in small: a white box on the hairline, 6px corners, the 12px display face in sentence case,
// told apart by a dot and the color of their text. `chip` is the guides' sky chip (.v7-guide-prose code): blue on a
// pale sky wash with a pale blue edge, for counts and filters.
const STATUS = "h-6 gap-1.5 rounded-sm border border-hairline bg-surface px-2 font-display text-caption leading-none before:size-1.5 before:shrink-0 before:rounded-pill before:bg-current";

const TAG = "rounded-none border border-current px-2 pt-0.75 pb-0.5 font-display text-micro [line-height:1.75] tracking-caps uppercase";

const badgeVariants = cva("inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3", {
  variants: {
    variant: {
      default: `${STATUS} text-fg-muted`,
      brand: `${STATUS} border-line-window bg-blue-5 text-fg-brand`,
      success: `${STATUS} text-success`,
      warning: `${STATUS} text-warning`,
      destructive: `${STATUS} text-danger`,
      tag: `${TAG} text-fg-brand`,
      "tag-ink": `${TAG} text-fg`,
      "tag-heart": `${TAG} text-heart`,
      chip: "h-6 rounded-sm border border-line-window bg-sky-wash px-2 font-display text-caption leading-none text-fg-brand",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({ className, variant, asChild = false, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
