import * as React from "react";

import { cn } from "@/lib/utils";

// A pale block holding a place while content loads, with a white sheen sliding across it on transform (constant motion,
// so linear); with reduced motion, the block alone.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-sm bg-subtle after:absolute after:inset-0 after:animate-shimmer after:bg-linear-to-r after:from-transparent after:via-surface after:to-transparent after:[animation-duration:1.4s] after:[animation-timing-function:linear] motion-reduce:after:hidden",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
