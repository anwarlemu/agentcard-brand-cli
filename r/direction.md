# Direction
Sets left-to-right or right-to-left reading for every Radix component inside it.

Install: npx agentcard-ds add direction
Requires: theme
Packages: @radix-ui/react-direction
Exports: DirectionProvider, useDirection
Client boundary: yes
Reference: Radix DirectionProvider; no visual of its own


## Usage
Wrap a right-to-left page or region in DirectionProvider dir="rtl" (and set dir on the element) so menus, sliders, tabs and the segmented track flip. Read it in a component with useDirection.
- Avoid: Setting direction only with CSS
- Avoid: Mixing directions inside one control


## Examples
Example components: npx agentcard-ds add direction segmented-control slider
[Site](https://agentcard-ds.vercel.app/preview/direction/Site)

examples/direction.tsx

```tsx
"use client";

import * as React from "react";

import { DirectionProvider } from "@/components/ui/direction";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";

export function Site() {
  const [period, setPeriod] = React.useState("day");
  return (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="grid w-full max-w-100 gap-4">
        <p className="font-display text-caption text-fg-muted">حد الإنفاق اليومي</p>
        <Slider aria-label="Daily limit" defaultValue={[40]} />
        <SegmentedControl label="Period" value={period} onValueChange={setPeriod} options={[{ value: "day", label: "يوم" }, { value: "week", label: "أسبوع" }, { value: "month", label: "شهر" }]} />
      </div>
    </DirectionProvider>
  );
}

```

## Source

components/ui/direction.tsx

```tsx
"use client";

import * as React from "react";
import * as DirectionPrimitive from "@radix-ui/react-direction";

// Sets the reading direction (ltr or rtl) for every Radix-based component inside it, so menus, sliders, tabs and the
// segmented track flip for right-to-left text. It renders nothing of its own; set dir on the element you wrap too.
function DirectionProvider({ dir, direction, children }: React.ComponentProps<typeof DirectionPrimitive.DirectionProvider> & { direction?: React.ComponentProps<typeof DirectionPrimitive.DirectionProvider>["dir"] }) {
  return <DirectionPrimitive.DirectionProvider dir={direction ?? dir}>{children}</DirectionPrimitive.DirectionProvider>;
}

const useDirection = DirectionPrimitive.useDirection;

export { DirectionProvider, useDirection };

```
