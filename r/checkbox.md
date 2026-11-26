# Checkbox
Checkbox with checked, unchecked, indeterminate and disabled states.

Install: npx agentcard-ds add checkbox
Requires: theme, utils
Packages: @radix-ui/react-checkbox, lucide-react
Exports: Checkbox
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (--bevel-blue, --bevel-muted)


## Usage
Use for multiple selections or a single agreement. Pair it with Label. When passing checked, update it through onCheckedChange.
- Avoid: Round checkboxes
- Avoid: Colors other than blue for checked
- Avoid: A checkbox for an action that happens at once (use a switch)


## Examples
Example components: npx agentcard-ds add checkbox label
[Site](https://agentcard-ds.vercel.app/preview/checkbox/Site)

examples/checkbox.tsx

```tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MERCHANTS = [
  { id: "airlines", label: "Airlines", checked: true },
  { id: "hotels", label: "Hotels", checked: true },
  { id: "software", label: "Software subscriptions", checked: false },
];

export function Site() {
  const [selected, setSelected] = useState(MERCHANTS.filter((merchant) => merchant.checked).map((merchant) => merchant.id));
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 font-display text-caption text-fg-muted">What this card can buy</legend>
      {MERCHANTS.map((merchant) => (
        <Label variant="control" key={merchant.id} htmlFor={`checkbox-${merchant.id}`}>
          <Checkbox id={`checkbox-${merchant.id}`} checked={selected.includes(merchant.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, merchant.id] : current.filter((id) => id !== merchant.id))} />
          {merchant.label}
        </Label>
      ))}
      <Label variant="control" htmlFor="checkbox-all" className="mt-2">
        <Checkbox id="checkbox-all" checked={selected.length === MERCHANTS.length ? true : selected.length ? "indeterminate" : false} onCheckedChange={(checked) => setSelected(checked ? MERCHANTS.map((merchant) => merchant.id) : [])} />
        All categories
      </Label>
      <Label variant="control" htmlFor="checkbox-disabled">
        <Checkbox id="checkbox-disabled" disabled />
        Cash withdrawals (never allowed)
      </Label>
    </fieldset>
  );
}

```

## Source

components/ui/checkbox.tsx

```tsx
"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

// A small key: a 20px white box on a 35 percent ink edge with the pale key's bevel; checked, it becomes the blue key
// (a darker blue edge, the light line inside the top) with a white check. The fill changes in 150ms ease-out.
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-sm border border-line-strong bg-surface text-on-primary shadow-key-muted outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger data-[state=checked]:border-line-brand-edge data-[state=checked]:bg-primary data-[state=checked]:shadow-key-brand data-[state=indeterminate]:border-line-brand-edge data-[state=indeterminate]:bg-primary data-[state=indeterminate]:shadow-key-brand motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-items-center [&_svg]:size-3.5">
        {props.checked === "indeterminate" ? <Minus strokeWidth={2.25} /> : <Check strokeWidth={2.25} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

```
