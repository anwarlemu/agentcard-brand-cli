# Radio Group
Round small keys for one choice from a short list; the chosen one is the blue key with a white dot.

Install: npx agentcard-ds add radio-group
Requires: theme, utils
Packages: @radix-ui/react-radio-group
Exports: RadioGroup, RadioGroupItem
Client boundary: yes
Reference: Extrapolated from agentcard-website src/app/globals.css (the checkbox's --bevel-muted and --bevel-blue keys)


## Usage
Use for one choice among two to five options that should all stay visible (a card type, a spending period). Pair each item with a Label variant="control". Give the root a name to submit with FormData; use a select for longer lists and a segmented control for a compact toolbar choice.
- Avoid: Square radios (that is a checkbox)
- Avoid: A radio for an action that happens at once
- Avoid: Colors other than blue for the chosen state


## Examples
Example components: npx agentcard-ds add radio-group label
[Site](https://agentcard-ds.vercel.app/preview/radio-group/Site) | [States](https://agentcard-ds.vercel.app/preview/radio-group/States) | [Horizontal](https://agentcard-ds.vercel.app/preview/radio-group/Horizontal)

examples/radio-group.tsx

```tsx
"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PERIODS = [
  { value: "purchase", label: "Per purchase" },
  { value: "day", label: "Per day" },
  { value: "month", label: "Per month" },
];

export function Site() {
  const [period, setPeriod] = React.useState("day");
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 font-display text-caption text-fg-muted">Spending limit applies</legend>
      <RadioGroup name="period" value={period} onValueChange={setPeriod}>
        {PERIODS.map((p) => (
          <Label variant="control" key={p.value} htmlFor={`period-${p.value}`}>
            <RadioGroupItem value={p.value} id={`period-${p.value}`} />
            {p.label}
          </Label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export function States() {
  return (
    <RadioGroup defaultValue="virtual" className="grid gap-3">
      <Label variant="control" htmlFor="card-virtual">
        <RadioGroupItem value="virtual" id="card-virtual" />
        Virtual card
      </Label>
      <Label variant="control" htmlFor="card-physical">
        <RadioGroupItem value="physical" id="card-physical" disabled />
        Physical card (coming soon)
      </Label>
      <Label variant="control" htmlFor="card-invalid">
        <RadioGroupItem value="none" id="card-invalid" aria-invalid />
        No card (choose one)
      </Label>
    </RadioGroup>
  );
}

export function Horizontal() {
  return (
    <RadioGroup defaultValue="usd" aria-label="Currency" className="flex flex-wrap gap-6">
      {["usd", "eur", "gbp"].map((c) => (
        <Label variant="control" key={c} htmlFor={`cur-${c}`}>
          <RadioGroupItem value={c} id={`cur-${c}`} />
          {c.toUpperCase()}
        </Label>
      ))}
    </RadioGroup>
  );
}

```

## Source

components/ui/radio-group.tsx

```tsx
"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

// The checkbox's small key made round (extrapolated from the brand's checkbox and its --bevel-blue): a 20px white circle
// on a 35 percent ink edge with the pale key's bevel; chosen, it becomes the blue key (a darker blue edge, the light line
// inside the top) with a white 8px dot. The fill changes in 150ms ease-out. Options stack 12px apart; pair each with a
// Label variant="control".
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-pill border border-line-strong bg-surface shadow-key-muted outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger data-[state=checked]:border-line-brand-edge data-[state=checked]:bg-primary data-[state=checked]:shadow-key-brand motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="size-2 rounded-pill bg-white" />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };

```
