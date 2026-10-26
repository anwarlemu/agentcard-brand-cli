# Popover
Anchored panel for contextual details or controls.

Install: npx agentcard-ds add popover
Requires: theme, surface, utils
Packages: @radix-ui/react-popover
Exports: Popover, PopoverAnchor, PopoverContent, PopoverTrigger
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (.v7-dock-card)


## Usage
Use for explanations, filters or small controls. Use variant="glass" over blue backgrounds or imagery. Keep longer tasks in Dialog or Sheet.
- Avoid: Forms longer than a few fields (use a dialog)
- Avoid: Popovers that open on hover (use a tooltip)
- Avoid: Gray panels


## Examples
Example components: npx agentcard-ds add popover button surface
[Site](https://agentcard-ds.vercel.app/preview/popover/Site) | [Open](https://agentcard-ds.vercel.app/preview/popover/Open) | [Glass](https://agentcard-ds.vercel.app/preview/popover/Glass)

examples/popover.tsx

```tsx
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Surface } from "@/lib/surface";

function Limits({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary">What are limits?</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-2">
        <p className="font-display text-body-sm font-medium text-fg">Spending limits</p>
        <p className="text-body-sm leading-relaxed text-fg-muted">Each card stops at its per purchase and monthly limits, whatever the agent tries to buy.</p>
      </PopoverContent>
    </Popover>
  );
}

export function Site() {
  return <Limits />;
}

export function Open() {
  return (
    <div className="h-48">
      <Limits defaultOpen />
    </div>
  );
}

export function Glass() {
  return (
    <Surface ground="blue" className="h-60 rounded-panel p-8">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="on-brand">About the dock</Button>
        </PopoverTrigger>
        <PopoverContent variant="glass" className="grid gap-1.5">
          <p className="font-display text-body-sm">Always in reach</p>
          <p className="text-body-sm leading-relaxed text-fg-on-brand-muted">The dock floats over every page, so the next step is one tap away.</p>
        </PopoverContent>
      </Popover>
    </Surface>
  );
}

```

## Source

components/ui/popover.tsx

```tsx
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// The brand's floating panel: white, a 16 percent ink hairline, 8px corners and the tooltip shadow, 6px off its trigger,
// growing out of the side nearest the trigger (scale 0.97 and a fade, 160ms ease-out). `glass` is the dock's panel: ink
// at 42 percent under a light sheen and a blur, a white hairline, white text. Reduced motion keeps only the fade.
const VARIANTS = {
  default: "border-hairline bg-surface text-fg shadow-tooltip",
  glass: "border-line-on-brand bg-glass bg-(image:--ds-glass-sheen) text-on-brand shadow-floating [backdrop-filter:var(--ds-glass-blur)]",
} as const;

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({ className, align = "start", sideOffset = 6, collisionPadding = 8, variant = "default", ...props }: React.ComponentProps<typeof PopoverPrimitive.Content> & { variant?: keyof typeof VARIANTS }) {
  return (
    <PopoverPrimitive.Portal container={usePortalContainer()}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        data-variant={variant}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("z-50 w-72 max-w-(--radix-popover-content-available-width) max-h-(--radix-popover-content-available-height) overflow-y-auto overscroll-contain origin-(--radix-popover-content-transform-origin) animate-pop-in motion-reduce:animate-none rounded-control border p-4 text-body-sm outline-none", VARIANTS[variant], className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };

```
