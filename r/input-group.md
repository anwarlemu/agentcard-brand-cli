# Input Group
The square field with labels, marks, a sunken segment or small keys inside it.

Install: npx agentcard-ds add input-group
Requires: theme, button, utils
Packages: class-variance-authority
Exports: InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea
Client boundary: yes
Reference: Extrapolated from agentcard.com/get-started (.v7-gate-field input) and the brand's keys


## Usage
Use when a field needs a unit, a prefix, a status or an action inside its border: an amount in USD, a domain, a Copy key on an API key, a search mark. Use InputGroupInput or InputGroupTextarea as the control and InputGroupAddon (align inline-start, inline-end, block-start or block-end) around it.
- Avoid: A second border inside the group
- Avoid: Rounded groups
- Avoid: Buttons larger than the field


## Examples
Example components: npx agentcard-ds add input-group label
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/input-group/Site) | [WithButton](https://agentcard-ds.vercel.app/preview/input-group/WithButton) | [Textarea](https://agentcard-ds.vercel.app/preview/input-group/Textarea) | [States](https://agentcard-ds.vercel.app/preview/input-group/States)

examples/input-group.tsx

```tsx
"use client";

import * as React from "react";
import { Check, Copy, Search } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

export function Site() {
  return (
    <div className="grid w-full max-w-100 gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="ig-limit">Monthly limit</Label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-limit" inputMode="decimal" defaultValue="500" />
          <InputGroupAddon align="inline-end" variant="segment">
            USD
          </InputGroupAddon>
        </InputGroup>
      </div>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search merchants" placeholder="Search merchants" />
      </InputGroup>
    </div>
  );
}

export function WithButton() {
  const key = "ac_live_4f9b2c71e8";
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="grid w-full max-w-100 gap-1.5">
      <Label htmlFor="ig-key">API key</Label>
      <InputGroup>
        <InputGroupInput id="ig-key" readOnly value={key} className="font-mono text-body-sm" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(key).then(() => setCopied(true), () => undefined)}
            aria-label={copied ? "Copied" : "Copy API key"}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export function Textarea() {
  return (
    <div className="grid w-full max-w-100 gap-1.5">
      <Label htmlFor="ig-brief">Instructions for the agent</Label>
      <InputGroup>
        <InputGroupTextarea id="ig-brief" placeholder="Book the cheapest refundable flight to Lisbon." />
        <InputGroupAddon align="block-end" className="justify-between">
          <InputGroupText>Under $400</InputGroupText>
          <InputGroupButton variant="primary">Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-100 gap-4">
      <InputGroup>
        <InputGroupInput aria-label="Card label" defaultValue="Travel card" aria-invalid />
        <InputGroupAddon align="inline-end" variant="segment">
          Taken
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Disabled" placeholder="Disabled" disabled />
      </InputGroup>
    </div>
  );
}

```

## Source

components/ui/input-group.tsx

```tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The brand's field with things inside it (extrapolated from agentcard.com/get-started, .v7-gate-field input): the
// field's square box and 35 percent ink border around a borderless control in 18px Inter, with addons at either end: a
// muted glyph or label in the 14px display face, a small key, or a `segment`, the pale wash with a hairline divider
// (a currency, a domain). Focus draws the form's 2px blue outline just inside the whole group, at once; an invalid
// control turns the group's border red. Addons can also sit above or below a textarea (block-start, block-end).
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex min-h-11 w-full min-w-0 items-center overflow-hidden rounded-none border border-line-strong bg-surface",
        "has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:-outline-offset-1 has-[[data-slot=input-group-control]:focus-visible]:outline-solid has-[[data-slot=input-group-control]:focus-visible]:outline-focus-ring",
        "has-[[data-slot][aria-invalid=true]]:border-danger",
        "has-[[data-slot=input-group-control]:disabled]:opacity-50 has-[[data-slot=input-group-control]:read-only]:bg-subtle",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2 has-[>[data-align=inline-end]]:[&>input]:pr-2 has-[>[data-align=block-start]]:[&>textarea]:pt-1 has-[>[data-align=block-end]]:[&>textarea]:pb-1",
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto shrink-0 cursor-text items-center justify-center gap-2 font-display text-body-sm leading-tight text-fg-muted select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:cursor-not-allowed [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:pl-1.5",
        "inline-end": "order-last pr-3 has-[>button]:pr-1.5",
        "block-start": "order-first w-full justify-start px-3 pt-2.5",
        "block-end": "order-last w-full justify-start px-3 pb-2.5",
      },
      variant: {
        plain: "",
        segment: "self-stretch border-hairline bg-subtle px-3 text-fg-secondary",
      },
    },
    compoundVariants: [
      { variant: "segment", align: "inline-end", className: "border-l pr-3" },
      { variant: "segment", align: "inline-start", className: "border-r pl-3" },
    ],
    defaultVariants: { align: "inline-start", variant: "plain" },
  },
);

function InputGroupAddon({ className, align = "inline-start", variant = "plain", ...props }: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      data-variant={variant}
      className={cn(inputGroupAddonVariants({ align, variant }), className)}
      onClick={(e) => {
        // A click on the addon (not on a button in it) focuses the control, as a click inside a field would.
        if ((e.target as HTMLElement).closest("button")) return;
        e.currentTarget.parentElement?.querySelector<HTMLElement>("input, textarea")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva("", {
  variants: {
    size: {
      xs: "h-7 gap-1.5 px-2.5 text-caption",
      sm: "h-8 gap-2 px-3 text-caption",
      "icon-xs": "size-7 p-0 [&_svg:not([class*='size-'])]:size-3.5",
      "icon-sm": "size-8 p-0 [&_svg:not([class*='size-'])]:size-4",
    },
  },
  defaultVariants: { size: "xs" },
});

/** A small key inside the field (Copy, Show, Apply). Defaults to the ghost key. */
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }: Omit<React.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>) {
  return <Button type={type} data-size={size} variant={variant} size="sm" className={cn(inputGroupButtonVariants({ size }), className)} {...props} />;
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("flex items-center gap-2 font-display text-body-sm leading-tight text-fg-muted [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className)} {...props} />;
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn("h-full min-h-10.5 min-w-0 flex-1 bg-transparent px-3 py-2.5 font-sans text-h5 leading-snug text-fg outline-none placeholder:text-fg-faint read-only:text-fg-muted disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn("field-sizing-content flex min-h-21 w-full min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 font-sans text-h5 leading-snug text-fg outline-none placeholder:text-fg-faint read-only:text-fg-muted disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea };

```
