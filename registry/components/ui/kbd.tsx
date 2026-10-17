import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A keyboard key, as the brand draws them (agentcard-website globals.css). `key` (the default) is .v7-guide-search-keys
// kbd, the keys in the guides' search footer: a white face on a pale blue edge, 4px corners, the label in the 10px
// display face in blue, at least 18px wide. `bare` is .v7-guide-search kbd, the hint at the end of the search box: the
// 12px display face at 45 percent ink, no face at all.
const kbdVariants = cva("inline-grid shrink-0 place-items-center font-display leading-none whitespace-nowrap", {
  variants: {
    variant: {
      key: "h-5 min-w-4.5 rounded-[calc(var(--ds-radius-control)/2)] border border-line-window bg-surface px-1 text-micro text-fg-brand",
      bare: "text-caption text-fg-faint",
    },
  },
  defaultVariants: { variant: "key" },
});

function Kbd({ className, variant, ...props }: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return <kbd data-slot="kbd" className={cn(kbdVariants({ variant }), className)} {...props} />;
}

export { Kbd, kbdVariants };
