# Select
Single-choice select with field, compact, ghost and chip treatments.

Install: npx agentcard-ds add select
Requires: theme, surface, field, utils
Packages: @radix-ui/react-select, lucide-react, class-variance-authority
Exports: Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue
Client boundary: yes
Reference: https://agentcard.com/get-started (native field); Radix menu extends repository guide styles


## Usage
Use the field appearance inside Field for forms. Use compact in dense rows and ghost or chip for filters. Field required is inherited by Select. Give Select a name for FormData; keep value and onValueChange on the root. Use compact on SelectContent for compact fields and toolbar menus.
- Avoid: Rounded field triggers
- Avoid: Empty string item values
- Avoid: Long lists without a search (use a command)
The field keeps the reference form's square border, 18px Inter and filled arrow. Its menu uses the same type size, fits the trigger and viewport, and wraps long option labels. Toolbar menus use `compact` for 14px display text.

For controlled forms, reset `value` from the form's `onReset` handler. `Field` displays your current error; validation and submitting to a backend belong to the form. A disabled item cannot be chosen. Prefer a segmented control when a small set of choices should remain visible.

## Examples
Example components: npx agentcard-ds add select button field
[Site](https://agentcard-ds.vercel.app/preview/select/Site) | [Controlled](https://agentcard-ds.vercel.app/preview/select/Controlled) | [Toolbar](https://agentcard-ds.vercel.app/preview/select/Toolbar) | [Form](https://agentcard-ds.vercel.app/preview/select/Form)

examples/select.tsx

```tsx
"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Site() {
  return (
    <div className="grid max-w-170 gap-4 sm:grid-cols-2">
      <Field label="Stage" htmlFor="select-stage">
        <Select>
          <SelectTrigger id="select-stage">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pre">Pre-launch</SelectItem>
            <SelectItem value="launched">Launched</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Money raised" htmlFor="select-raised">
        <Select defaultValue="seed">
          <SelectTrigger id="select-raised">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Bootstrapped</SelectItem>
            <SelectItem value="seed">Under $1M</SelectItem>
            <SelectItem value="a">$1M to $5M</SelectItem>
            <SelectItem value="b">$5M to $20M</SelectItem>
            <SelectItem value="c">More than $20M</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function Controlled() {
  const [value, setValue] = React.useState("a");
  return (
    <div className="h-80 max-w-83">
      <Field label="Money raised" htmlFor="select-open">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger id="select-open">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Bootstrapped</SelectItem>
            <SelectItem value="seed">Under $1M</SelectItem>
            <SelectItem value="a">$1M to $5M</SelectItem>
            <SelectItem value="b">$5M to $20M</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="30">
        <SelectTrigger appearance="ghost" aria-label="Period">
          <SelectValue />
        </SelectTrigger>
        <SelectContent compact>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger appearance="chip" aria-label="Card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent compact>
          <SelectItem value="all">All cards</SelectItem>
          <SelectItem value="travel">Travel agent</SelectItem>
          <SelectItem value="ops">Ops agent</SelectItem>
        </SelectContent>
      </Select>
      <div className="w-56">
        <Select defaultValue="usd">
          <SelectTrigger compact aria-label="Currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent compact>
            <SelectItem value="usd">US dollar</SelectItem>
            <SelectItem value="eur">Euro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function Form() {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState("");
  return (
    <form className="grid min-w-0 max-w-83 gap-5" noValidate onSubmit={event => {
      event.preventDefault();
      if (!value) { setError("Choose a card before continuing."); setResult(""); return; }
      setError("");
      setResult(`Selected: ${new FormData(event.currentTarget).get("card")}.`);
    }} onReset={() => { setValue(""); setError(""); setResult(""); }}>
      <Field label="Card" required error={error} help="Choose the card this agent can use.">
        <Select name="card" value={value} onValueChange={next => { setValue(next); setError(""); setResult(""); }}>
          <SelectTrigger><SelectValue placeholder="Choose a card" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="travel" description="Flights and hotels">Travel agent</SelectItem>
            <SelectItem value="operations">Operations and recurring software subscriptions</SelectItem>
            <SelectItem value="archived" disabled>Archived card (unavailable)</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Billing currency" help="The currency is set when the card is created.">
        <Select defaultValue="usd" disabled>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="usd">US dollar</SelectItem></SelectContent>
        </Select>
      </Field>
      <div className="flex gap-3"><Button type="submit">Continue</Button><Button type="reset" variant="secondary">Reset</Button></div>
      <p role="status" className="text-body-sm text-fg-muted empty:hidden">{result}</p>
    </form>
  );
}

```

## Source

components/ui/select.tsx

```tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { usePortalContainer } from "@/lib/surface";
import { useFieldControl } from "@/components/ui/field";
import { cn } from "@/lib/utils";

// A single choice. `field` is the brand's select (the get-started form, .v7-gate-field select): the input's square box,
// 35 percent ink border and 18px Inter, 10px by 12px of padding, with a small ink triangle (10 by 5px) 13px in from the
// right; focus is the form's 2px blue outline laid over the border. `compact` shortens it to 14px for dense rows. `ghost`
// is the white key for a toolbar, `chip` a quiet label on a wash. The list is the brand's floating panel (white, a
// hairline, 8px corners) growing from its trigger in a quick ease-out; the row under the pointer or the keys takes the
// guides' search results' sky wash (.v7-guide-search-results [aria-selected]), the chosen one a blue tick.
const triggerVariants = cva(
  "flex min-w-0 max-w-full items-center gap-2 whitespace-nowrap outline-none transition-[background-color,border-color,box-shadow,color,translate] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:shrink-0 [&>[data-slot=select-value]]:min-w-0 [&>[data-slot=select-value]]:truncate [&>[data-slot=select-value]]:text-left",
  {
    variants: {
      appearance: {
        field:
          "w-full gap-3.25 rounded-none border border-line-strong bg-surface font-sans text-fg focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring data-[state=open]:outline-2 data-[state=open]:-outline-offset-1 data-[state=open]:outline-solid data-[state=open]:outline-focus-ring data-placeholder:text-fg aria-invalid:border-danger [&>span]:flex-1 [&>span]:truncate [&>span]:text-left",
        ghost:
          "h-8 rounded-control border border-hairline bg-surface px-3 font-display text-caption text-fg shadow-key hover:bg-sky-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed data-[state=open]:bg-sky-wash motion-reduce:active:translate-y-0",
        chip: "h-7 rounded-sm bg-wash-pill px-2.5 font-display text-caption text-fg-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring data-[state=open]:text-fg",
      },
      // A shorter field, for dense rows.
      compact: { true: "", false: "" },
    },
    compoundVariants: [
      { appearance: "field", compact: false, className: "min-h-11 py-2.5 pr-3.25 pl-3 text-h5 leading-snug" },
      { appearance: "field", compact: true, className: "h-9 pr-3.25 pl-2.5 text-body-sm" },
    ],
    defaultVariants: { appearance: "field", compact: false },
  },
);

/** The brand's select mark: a small filled triangle, 10 by 5px, pointing down. */
function SelectMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 10 5" className={cn("h-1.25 w-2.5 fill-current", className)}>
      <path d="M0 0h10L5 5z" />
    </svg>
  );
}

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const { required } = useFieldControl({ required: props.required });
  return <SelectPrimitive.Root data-slot="select" {...props} required={required} />;
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({ className, appearance, compact, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & VariantProps<typeof triggerVariants>) {
  const { required, ...control } = useFieldControl(props);
  return (
    <SelectPrimitive.Trigger data-slot="select-trigger" className={cn(triggerVariants({ appearance, compact }), className)} aria-required={required || undefined} {...control}>
      {children}
      <SelectPrimitive.Icon asChild>
        <SelectMark className={appearance === "field" || appearance == null ? "ml-auto text-fg" : "text-fg-muted"} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className, children, compact = false, position = "popper", collisionPadding = 8, ...props }: React.ComponentProps<typeof SelectPrimitive.Content> & { compact?: boolean }) {
  return (
    <SelectPrimitive.Portal container={usePortalContainer()}>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        collisionPadding={collisionPadding}
        sideOffset={4}
        align="start"
        className={cn(
          "relative z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-0 max-w-(--radix-select-content-available-width) origin-(--radix-select-content-transform-origin) animate-pop-in motion-reduce:animate-none overflow-hidden rounded-control border border-hairline bg-surface p-1 leading-snug text-fg shadow-tooltip",
          position === "popper" && "w-[max(11rem,var(--radix-select-trigger-width))]",
          compact ? "font-display text-body-sm" : "font-sans text-h5",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-fg-muted">
          <ChevronUp className="size-3.5" strokeWidth={1.5} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="flex w-full flex-col gap-0.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-fg-muted">
          <ChevronDown className="size-3.5" strokeWidth={1.5} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label data-slot="select-label" className={cn("px-2.5 pt-1.5 pb-1 font-display text-caption text-fg-muted", className)} {...props} />;
}

function SelectItem({ className, children, description, ...props }: React.ComponentProps<typeof SelectPrimitive.Item> & { description?: React.ReactNode }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-start gap-2 rounded-sm py-2 pr-8 pl-2.5 break-words text-fg-secondary outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-search-selected data-[highlighted]:text-fg data-[state=checked]:text-fg",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description && <span className="mt-0.5 block font-sans text-caption text-fg-muted">{description}</span>}
      </span>
      <SelectPrimitive.ItemIndicator className="absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-brand">
        <Check className="size-3.5" strokeWidth={1.75} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue };

```
