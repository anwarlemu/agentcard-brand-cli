"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

// A sunken track (pale, a hairline, the inner shadow, the tab track in small) with a blue fill (a card's balance spent, a
// setup's steps). The fill moves on transform in 300ms ease-out; reduced motion sets it at once.
function Progress({ className, value, max = 100, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = typeof value === "number" && Number.isFinite(value) ? Math.min(limit, Math.max(0, value)) : null;
  return (
    <ProgressPrimitive.Root value={current} max={limit} data-slot="progress" className={cn("relative h-2 w-full overflow-hidden rounded-chip border border-hairline bg-subtle shadow-well", className)} {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${100 - ((current ?? 0) / limit) * 100}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
