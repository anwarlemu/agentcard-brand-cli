# Skeleton
Placeholder that reserves space while content loads.

Install: npx agentcard-ds add skeleton
Requires: theme, utils
Packages: none
Exports: Skeleton
Client boundary: not required by this entry file
Reference: Extension from agentcard-website src/app/globals.css (--palette-ink 7 percent)


## Usage
Match the expected content dimensions and replace it when loading completes.
- Avoid: Skeletons for content that loads at once
- Avoid: Gray blocks that do not match the final layout
- Avoid: Colored sheens


## Examples
Example components: npx agentcard-ds add skeleton
[Site](https://agentcard-ds.vercel.app/preview/skeleton/Site)

examples/skeleton.tsx

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function Site() {
  return (
    <div className="grid max-w-md gap-4 rounded-card border border-hairline bg-surface p-6 shadow-card">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="mt-2 h-10 w-32 rounded-control" />
    </div>
  );
}

```

## Source

components/ui/skeleton.tsx

```tsx
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

```
