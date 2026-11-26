# Native Select
The browser's own select dressed as the brand's square field with the small ink triangle.

Install: npx agentcard-ds add native-select
Requires: theme, utils
Packages: none
Exports: NativeSelect, NativeSelectOptGroup, NativeSelectOption
Client boundary: not required by this entry file
Reference: agentcard.com/get-started (.v7-gate-field select, computed)


## Usage
Use where the platform picker is better than a custom menu: phones, long lists of countries or currencies, and forms that must work without script. Pair it with Field or a Label. Use size="sm" in dense rows.
- Avoid: Rounded corners
- Avoid: A custom arrow other than the triangle
- Avoid: Placeholder options that can be submitted


## Examples
Example components: npx agentcard-ds add native-select field
[Site](https://agentcard-ds.vercel.app/preview/native-select/Site) | [States](https://agentcard-ds.vercel.app/preview/native-select/States)

examples/native-select.tsx

```tsx
import { Field } from "@/components/ui/field";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";

export function Site() {
  return (
    <div className="grid w-full max-w-86 gap-4">
      <Field label="Card currency" htmlFor="native-currency">
        <NativeSelect id="native-currency" name="currency" defaultValue="usd">
          <NativeSelectOptGroup label="Most used">
            <NativeSelectOption value="usd">US dollar</NativeSelectOption>
            <NativeSelectOption value="eur">Euro</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Others">
            <NativeSelectOption value="gbp">British pound</NativeSelectOption>
            <NativeSelectOption value="jpy">Japanese yen</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </Field>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-86 gap-4">
      <NativeSelect aria-label="Compact" size="sm" defaultValue="all">
        <NativeSelectOption value="all">All agents</NativeSelectOption>
        <NativeSelectOption value="travel">Travel agent</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-label="Invalid" aria-invalid defaultValue="">
        <NativeSelectOption value="" disabled>
          Choose a merchant category
        </NativeSelectOption>
        <NativeSelectOption value="air">Airlines</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-label="Disabled" disabled defaultValue="usd">
        <NativeSelectOption value="usd">US dollar</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

```

## Source

components/ui/native-select.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// The browser's own select dressed as the brand's field (agentcard.com/get-started, .v7-gate-field select): the input's
// square box, 35 percent ink border and 18px Inter, 10px by 12px of padding, with the small ink triangle (10 by 5px)
// 13px in from the right; focus is the form's 2px blue outline laid over the border. `size="sm"` is the compact 36px
// field in the 14px face. Use it where the platform picker is better (phones, long lists, forms without script).
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" };

function NativeSelect({ className, size = "default", ...props }: NativeSelectProps) {
  return (
    <div data-slot="native-select-wrapper" data-size={size} className={cn("group/native-select relative w-full has-[select:disabled]:opacity-50", className)}>
      <select
        data-slot="native-select"
        data-size={size}
        className="min-h-11 w-full min-w-0 cursor-pointer appearance-none rounded-none border border-line-strong bg-surface py-2.5 pr-9 pl-3 font-sans text-h5 leading-snug text-fg outline-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed aria-invalid:border-danger data-[size=sm]:h-9 data-[size=sm]:min-h-0 data-[size=sm]:py-0 data-[size=sm]:pl-2.5 data-[size=sm]:text-body-sm"
        {...props}
      />
      <svg aria-hidden data-slot="native-select-icon" viewBox="0 0 10 5" className="pointer-events-none absolute top-1/2 right-3.25 h-1.25 w-2.5 -translate-y-1/2 fill-current text-fg">
        <path d="M0 0h10L5 5z" />
      </svg>
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-surface text-fg", className)} {...props} />;
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" className={cn("bg-surface text-fg", className)} {...props} />;
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };

```
