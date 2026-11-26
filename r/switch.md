# Switch
Toggle for a setting that takes effect immediately.

Install: npx agentcard-ds add switch
Requires: theme, utils
Packages: @radix-ui/react-switch
Exports: Switch
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (THE PLAN TABS, --bevel-white)


## Usage
Pair with Label. Connect checked and onCheckedChange when the application owns the setting.
- Avoid: Pill-shaped switches
- Avoid: Colors other than blue for on
- Avoid: A switch inside a form that needs a submit (use a checkbox)


## Examples
Example components: npx agentcard-ds add switch label
[Site](https://agentcard-ds.vercel.app/preview/switch/Site)

examples/switch.tsx

```tsx
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Site() {
  return (
    <div className="grid max-w-sm gap-4">
      <div className="flex items-center justify-between gap-4">
        <Label variant="control" htmlFor="switch-receipts">Email a receipt for every purchase</Label>
        <Switch id="switch-receipts" defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label variant="control" htmlFor="switch-pause">Pause this card</Label>
        <Switch id="switch-pause" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label variant="control" htmlFor="switch-locked">International purchases</Label>
        <Switch id="switch-locked" disabled />
      </div>
    </div>
  );
}

```

## Source

components/ui/switch.tsx

```tsx
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

// The brand's track and key, in small: off, a sunken track (pale, a hairline, the inner shadow) with a white key at the
// left; on, the track turns blue and the key slides right (200ms ease-out, on transform). The key sits 2px inside the
// track, its corners concentric with the track's 8px. Reduced motion moves it at once.
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-control border outline-none transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-line-brand-edge data-[state=checked]:bg-primary data-[state=checked]:shadow-pressed data-[state=unchecked]:border-hairline data-[state=unchecked]:bg-subtle data-[state=unchecked]:shadow-well motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4.5 translate-x-0.5 rounded-sm border border-hairline bg-white shadow-key transition-[translate] duration-200 ease-out data-[state=checked]:translate-x-5.5 motion-reduce:transition-none"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

```
