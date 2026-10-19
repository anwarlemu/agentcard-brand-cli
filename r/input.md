# Input
Single-line text field with standard and search variants.

Install: npx agentcard-ds add input
Requires: theme, field, utils
Packages: class-variance-authority
Exports: Input, inputVariants
Client boundary: yes
Reference: agentcard-website src/app/globals.css (.v7-gate-field input, .v7-guide-search); live https://www.agentcard.sh/get-started (computed)


## Usage
Use inside Field for a label and validation message. Set an appropriate input type. Use variant="search" for search or filtering and connect changes to the results.
- Avoid: Rounded form fields (only the search box has corners)
- Avoid: Gray filled inputs
- Avoid: Placeholder text as the only label
- Avoid: A glow or ring on focus (the brand draws the outline)


## Examples
Example components: npx agentcard-ds add input field
[Site](https://agentcard-ds.vercel.app/preview/input/Site) | [States](https://agentcard-ds.vercel.app/preview/input/States) | [Search](https://agentcard-ds.vercel.app/preview/input/Search)

examples/input.tsx

```tsx
"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Site() {
  return (
    <div className="grid max-w-170 gap-4">
      <Field label="Your name" htmlFor="input-name">
        <Input id="input-name" autoComplete="name" />
      </Field>
      <Field label="Work email" htmlFor="input-email">
        <Input id="input-email" type="email" autoComplete="email" />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company" htmlFor="input-company">
          <Input id="input-company" />
        </Field>
        <Field label="Website" htmlFor="input-site">
          <Input id="input-site" placeholder="acme.com" />
        </Field>
      </div>
    </div>
  );
}

export function States() {
  const [email, setEmail] = useState("ada@");
  const [valid, setValid] = useState(false);
  return (
    <div className="grid max-w-170 gap-4">
      <Field label="Work email" htmlFor="input-invalid" error={valid ? undefined : "Enter a valid work email address."} help="Email address accepted.">
        <Input id="input-invalid" type="email" value={email} required onChange={(event) => { setEmail(event.target.value); setValid(event.target.validity.valid); }} />
      </Field>
      <Field label="Card nickname" htmlFor="input-disabled" help="Set by your team admin.">
        <Input id="input-disabled" defaultValue="Travel agent" disabled />
      </Field>
    </div>
  );
}

export function Search() {
  const [query, setQuery] = useState("");
  const guides = ["Create a card", "Set spending limits", "Manage merchants"].filter((guide) => guide.toLowerCase().includes(query.toLowerCase().trim()));
  return (
    <div className="max-w-80">
      <Input variant="search" placeholder="Search the guides" aria-label="Search the guides" value={query} onChange={(event) => setQuery(event.target.value)} />
      <ul aria-live="polite" className="mt-3 text-body-sm text-fg-muted">{guides.length ? guides.map((guide) => <li key={guide}>{guide}</li>) : <li>No guides match your search.</li>}</ul>
    </div>
  );
}

```

## Source

components/ui/input.tsx

```tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { useFieldControl } from "@/components/ui/field";
import { cn } from "@/lib/utils";

// Two fields. `field` is the get-started form's (agentcard.sh/get-started, .v7-gate-field input, computed): square, a
// 35 percent ink border, 18px Inter at 1.3 leading, 10px by 12px of padding, at least 44px tall; focus draws a 2px blue
// outline just inside the edge, at once (no transition); an invalid field's border is red. `search` is the guides'
// search box (agentcard-website src/app/globals.css .v7-guide-search): 36px, 8px corners, a 12 percent ink edge that
// darkens to 24 percent under the pointer (160ms ease-out), white with a faint inner shadow, 14px Inter, a 15px ink
// search mark 12px in with 10px to the text; focus is the 2px blue outline 2px out.
const inputVariants = cva(
  "flex w-full min-w-0 bg-surface text-fg outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        field:
          "min-h-11 rounded-none border border-line-strong px-3 py-2.5 font-sans text-h5 leading-snug placeholder:text-fg-faint focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring aria-invalid:border-danger file:border-0 file:bg-transparent file:font-display file:text-body-sm file:text-fg",
        search:
          "h-9 rounded-control border border-line-field pr-3 pl-9.25 font-sans text-body-sm shadow-inset transition-[border-color] duration-160 ease-out placeholder:text-fg-muted hover:border-line-field-hover focus-visible:outline-2 focus-visible:outline-solid motion-reduce:transition-none focus-visible:outline-offset-2 focus-visible:outline-focus-ring [&::-webkit-search-cancel-button]:hidden",
      },
    },
    defaultVariants: { variant: "field" },
  },
);

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 fill-none stroke-current text-fg [stroke-linecap:round] [stroke-width:1.5]">
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

function Input({ className, type, variant, ...props }: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  const input = <input type={variant === "search" ? (type ?? "search") : type} data-slot="input" className={cn(inputVariants({ variant }), variant !== "search" && className)} {...useFieldControl(props)} />;
  if (variant !== "search") return input;
  return (
    <div data-slot="search" className={cn("relative w-full", className)}>
      <SearchIcon />
      {input}
    </div>
  );
}

export { Input, inputVariants };

```
