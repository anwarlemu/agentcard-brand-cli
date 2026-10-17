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
