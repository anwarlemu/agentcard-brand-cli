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
