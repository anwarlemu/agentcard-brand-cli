# Toggle Group
Keys in the sunken tab track, the chosen ones blue; or separate white keys that stay pressed.

Install: npx agentcard-ds add toggle-group
Requires: theme, toggle, utils
Packages: @radix-ui/react-toggle-group, class-variance-authority
Exports: ToggleGroup, ToggleGroupItem
Client boundary: yes
Reference: Extrapolated from agentcard.com/pricing (.plan-tabs) and the brand's keys


## Usage
Use type="single" for one view choice or type="multiple" for filters that can combine (Airlines, Hotels, Software). The default sits in the tab track; use variant="outline" for toolbar keys, with spacing={0} to join them. Use SegmentedControl for a single choice whose blue key should glide.
- Avoid: Mixing the track and outline styles in one group
- Avoid: More than six choices in a track
- Avoid: A gliding key in a multiple group


## Examples
Example components: npx agentcard-ds add toggle-group
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/toggle-group/Site) | [Outline](https://agentcard-ds.vercel.app/preview/toggle-group/Outline) | [Sizes](https://agentcard-ds.vercel.app/preview/toggle-group/Sizes)

examples/toggle-group.tsx

```tsx
"use client";

import * as React from "react";
import { LayoutGrid, List, Rows3 } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Site() {
  const [merchants, setMerchants] = React.useState(["airlines", "hotels"]);
  return (
    <div className="grid gap-3">
      <p id="merchant-label" className="font-display text-caption text-fg-muted">
        This card can buy from
      </p>
      <ToggleGroup type="multiple" aria-labelledby="merchant-label" value={merchants} onValueChange={setMerchants}>
        <ToggleGroupItem value="airlines">Airlines</ToggleGroupItem>
        <ToggleGroupItem value="hotels">Hotels</ToggleGroupItem>
        <ToggleGroupItem value="software">Software</ToggleGroupItem>
        <ToggleGroupItem value="groceries">Groceries</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function Outline() {
  return (
    <div className="grid gap-4">
      <ToggleGroup type="single" variant="outline" defaultValue="grid" aria-label="View">
        <ToggleGroupItem value="grid" aria-label="Grid">
          <LayoutGrid />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List">
          <List />
        </ToggleGroupItem>
        <ToggleGroupItem value="rows" aria-label="Rows">
          <Rows3 />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" spacing={0} defaultValue="week" aria-label="Period">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="grid gap-4">
      <ToggleGroup type="single" size="sm" defaultValue="all" aria-label="Status">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="approved">Approved</ToggleGroupItem>
        <ToggleGroupItem value="declined">Declined</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="monthly" aria-label="Billing">
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
        <ToggleGroupItem value="custom" disabled>
          Custom
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

```

## Source

components/ui/toggle-group.tsx

```tsx
"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

// The brand's tab track holding several keys (.plan-tabs on /pricing): a sunken track (the pale wash, a hairline, the
// inner shadow) with 12px corners and 4px inside, its choices 40px display labels with 8px corners; a chosen one is the
// blue key (a darker blue edge, the bevel). Unlike SegmentedControl nothing glides: a group may hold several chosen keys,
// and a choice made often must feel immediate. `variant="outline"` drops the track: separate white keys that stay pressed
// when on. `spacing={0}` joins outline keys into one bar.
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants> & { spacing?: number; orientation?: "horizontal" | "vertical" }>({
  size: "default",
  variant: "default",
  spacing: 1,
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  spacing = 1,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants> & { spacing?: number; orientation?: "horizontal" | "vertical" }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit max-w-full items-center gap-[calc(var(--spacing)*var(--gap))] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        variant === "default" && "overflow-x-auto rounded-card border border-hairline bg-subtle p-1 shadow-well [scrollbar-width:none]",
        variant === "outline" && spacing === 0 && "*:data-[slot=toggle-group-item]:not-first:-ml-px *:data-[slot=toggle-group-item]:not-first:rounded-l-none *:data-[slot=toggle-group-item]:not-last:rounded-r-none",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({ className, children, variant, size, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  const v = context.variant || variant || "default";
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={v}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({ variant: v, size: context.size || size }),
        // In the track the chosen choice is the blue key, as in the plan tabs.
        v === "default" && "hover:bg-wash-pill data-[state=on]:border-line-brand-edge data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:shadow-key-brand data-[state=on]:hover:bg-primary-hover",
        "focus-visible:z-10",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };

```
