# Progress
Progress bar with a value, maximum and accessible progress state.

Install: npx agentcard-ds add progress
Requires: theme, utils
Packages: @radix-ui/react-progress
Exports: Progress
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (.plan-tabs, --bevel-blue)


## Usage
Use for spending limits, uploads or setup progress. Update value as progress changes and set max when the scale is not 100. Give the bar an accessible label.
- Avoid: Gradients in the fill
- Avoid: Pill-shaped tracks
- Avoid: Progress without a label saying what it measures


## Examples
Example components: npx agentcard-ds add progress button
[Site](https://agentcard-ds.vercel.app/preview/progress/Site)

examples/progress.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function Site() {
  const [spent, setSpent] = useState(1240);
  return <div className="grid max-w-md gap-3">
    <div className="flex items-baseline justify-between gap-3 font-display text-body-sm"><span>Spent this month</span><span className="text-fg-muted tabular-nums">${spent.toLocaleString("en-US")} of $2,000</span></div>
    <Progress value={spent} max={2000} aria-label="Spent this month" />
    <div className="flex gap-2"><Button size="sm" disabled={spent >= 2000} onClick={() => setSpent(Math.min(2000, spent + 100))}>Spend $100</Button><Button variant="secondary" size="sm" onClick={() => setSpent(1240)}>Reset</Button></div>
  </div>;
}

```

## Source

components/ui/progress.tsx

```tsx
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

```
