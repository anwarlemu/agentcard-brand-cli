# Collapse
Expandable content area that animates its height.

Install: npx agentcard-ds add collapse
Requires: theme, utils
Packages: none
Exports: Collapse
Client boundary: yes
Reference: agentcard-website src/app/globals.css (the FAQ's slide, .faq-list details::details-content)


## Usage
Use for optional form fields, settings or details. Connect open to state and give the trigger aria-expanded and aria-controls.
- Avoid: Hiding the main action
- Avoid: Nesting collapses
- Avoid: Questions and answers (use the accordion)


## Examples
Example components: npx agentcard-ds add collapse button field input
[Site](https://agentcard-ds.vercel.app/preview/collapse/Site)

examples/collapse.tsx

```tsx
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Collapse } from "@/components/ui/collapse";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Site() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Button variant="secondary" size="sm" className="self-start" aria-expanded={open} aria-controls="collapse-limits" onClick={() => setOpen((o) => !o)}>
        {open ? "Hide spending limits" : "Set spending limits"}
      </Button>
      <Collapse open={open} id="collapse-limits" className="flex flex-col gap-4 pt-1">
        <Field label="Per purchase" htmlFor="collapse-per" help="The most this card can spend at one checkout.">
          <Input id="collapse-per" defaultValue="$250" />
        </Field>
        <Field label="Per month" htmlFor="collapse-month">
          <Input id="collapse-month" defaultValue="$2,000" />
        </Field>
      </Collapse>
      <p className="text-body-sm text-fg-muted">Everything below glides rather than jumps.</p>
    </div>
  );
}

```

## Source

components/ui/collapse.tsx

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Grows from nothing to its content's height and back (300ms ease-out on the grid's rows, with a fade), so whatever
 * sits below glides rather than jumps. Stays mounted while closed (inert, so nothing inside takes focus), and clips only
 * until it has fully opened, so menus inside can still spill out of it. Reduced motion opens and closes at once.
 */
function Collapse({ open, id, className, children }: { open: boolean; id?: string; className?: string; children: React.ReactNode }) {
  const [isFullyOpen, setFullyOpen] = React.useState(open);
  if (!open && isFullyOpen) setFullyOpen(false);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (open && event.target === event.currentTarget && event.propertyName === "grid-template-rows") setFullyOpen(true);
  };

  return (
    <div
      id={id}
      data-slot="collapse"
      data-state={open ? "open" : "closed"}
      inert={!open}
      onTransitionEnd={handleTransitionEnd}
      className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
    >
      <div className={cn("min-h-0", !isFullyOpen && "overflow-hidden", open && "motion-reduce:overflow-visible")}>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

export { Collapse };

```
