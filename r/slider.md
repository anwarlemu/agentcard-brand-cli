# Slider
A sunken track filled with the blue key up to the value, with the switch's white key riding on it.

Install: npx agentcard-ds add slider
Requires: theme, utils
Packages: @radix-ui/react-slider
Exports: Slider
Client boundary: yes
Reference: Extrapolated from the brand's switch and tab track (agentcard-website src/app/globals.css .plan-tabs, --bevel)


## Usage
Use to set an amount within a range where the exact figure matters less than its size (a daily limit, a share of a budget). Show the current value beside it, give it an aria-label or a Label, and pass two values for a range.
- Avoid: A slider for an exact amount someone must type (use a field)
- Avoid: Animating the key's position
- Avoid: A round blue knob


## Examples
Example components: npx agentcard-ds add slider label
[Site](https://agentcard-ds.vercel.app/preview/slider/Site) | [Range](https://agentcard-ds.vercel.app/preview/slider/Range) | [States](https://agentcard-ds.vercel.app/preview/slider/States)

examples/slider.tsx

```tsx
"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function Site() {
  const [limit, setLimit] = React.useState([250]);
  return (
    <div className="grid w-full max-w-100 gap-3">
      <div className="flex items-baseline justify-between">
        <Label id="limit-label">Daily spending limit</Label>
        <span className="font-display text-body-sm text-fg tabular-nums">${limit[0]}</span>
      </div>
      <Slider aria-labelledby="limit-label" value={limit} onValueChange={setLimit} max={1000} step={25} />
    </div>
  );
}

export function Range() {
  const [range, setRange] = React.useState([20, 400]);
  return (
    <div className="grid w-full max-w-100 gap-3">
      <div className="flex items-baseline justify-between">
        <Label id="range-label">Allowed purchase size</Label>
        <span className="font-display text-body-sm text-fg tabular-nums">
          ${range[0]} to ${range[1]}
        </span>
      </div>
      <Slider aria-labelledby="range-label" value={range} onValueChange={setRange} max={1000} step={10} minStepsBetweenThumbs={1} />
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-100 gap-6">
      <Slider aria-label="Disabled limit" defaultValue={[60]} disabled />
      <div className="flex h-40 gap-8">
        <Slider aria-label="Vertical limit" defaultValue={[40]} orientation="vertical" />
      </div>
    </div>
  );
}

```

## Source

components/ui/slider.tsx

```tsx
"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

// The switch's track and key drawn long (extrapolated from the brand's switch and tab track): a 10px sunken track (the
// pale wash, a hairline, the inner shadow) with 8px corners, filled with the blue key up to the value, and the switch's
// 18px white key with its bevel riding on it. Under focus the key takes the 2px blue outline. The key never animates its
// position: it follows the pointer and the arrow keys exactly. Pass two values for a range.
function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = React.useMemo(() => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]), [value, defaultValue, min, max]);
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-control border border-hairline bg-subtle shadow-well data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5"
      >
        <SliderPrimitive.Range data-slot="slider-range" className="absolute bg-primary shadow-key-brand data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={props["aria-label"] ? undefined : values.length > 1 ? (index === 0 ? "Minimum" : "Maximum") : undefined}
          className="block size-4.5 shrink-0 cursor-grab rounded-sm border border-hairline bg-white shadow-key outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring active:cursor-grabbing disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };

```
