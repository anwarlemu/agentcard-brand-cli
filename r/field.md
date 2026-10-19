# Field
Label, help text, error message and accessibility attributes for a form control.

Install: npx agentcard-ds add field
Requires: theme, label, utils
Packages: none
Exports: Field, useFieldControl
Client boundary: yes
Reference: agentcard-website src/app/globals.css (.v7-gate-field); live https://www.agentcard.sh/get-started


## Usage
Wrap Input, Textarea, TagsInput or SelectTrigger. Derive error from the current value and clear it when valid. Use required for required fields and htmlFor when the control has an explicit id.
- Avoid: Labels inside the field as placeholders
- Avoid: Bold or caps labels
- Avoid: Errors shown only by color
`Field` connects its label and help/error message to `Input`, `Textarea`, `TagsInput`, and `SelectTrigger`. It also shares required and invalid state. Set `htmlFor` when you give the control an explicit `id`; otherwise the field generates an ID.

Validation belongs to your form. Derive `error` from the current value and pass `undefined` when valid, as in the live example. A static error string stays visible until your form clears it. Set `required` on the `Select` root as well for native form validation. For a custom control, use `useFieldControl` to connect the same attributes.

## Examples
Example components: npx agentcard-ds add field input
[Site](https://agentcard-ds.vercel.app/preview/field/Site)

examples/field.tsx

```tsx
"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function isWebAddress(value: string) {
  const text = value.trim();
  if (!text || /\s/.test(text)) return false;
  try {
    const url = new URL(text.includes("://") ? text : `https://${text}`);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password &&
      url.hostname.includes(".") && url.hostname.split(".").every((part) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(part));
  } catch { return false; }
}

export function Site() {
  const [website, setWebsite] = useState("acme");
  const valid = isWebAddress(website);
  return (
    <div className="grid max-w-170 gap-4">
      <Field label="Work email" htmlFor="field-email" required help="We reply within a day.">
        <Input id="field-email" type="email" autoComplete="email" />
      </Field>
      <Field label="Website" htmlFor="field-site" error={valid ? undefined : "Enter a web address, like acme.com."} help="Web address accepted.">
        <Input id="field-site" value={website} onChange={(event) => setWebsite(event.target.value)} autoComplete="url" inputMode="url" />
      </Field>
    </div>
  );
}

```

## Source

components/ui/field.tsx

```tsx
"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldState = { id: string; description?: string; invalid: boolean; required: boolean };
const FieldContext = React.createContext<FieldState | undefined>(undefined);

/** Connect a control to its Field without replacing its own IDs or accessibility descriptions. */
function useFieldControl<T extends { id?: string; required?: boolean; "aria-invalid"?: React.AriaAttributes["aria-invalid"]; "aria-describedby"?: string }>(props: T) {
  const field = React.useContext(FieldContext);
  return {
    ...props,
    id: props.id ?? field?.id,
    required: props.required ?? field?.required,
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
    "aria-describedby": [props["aria-describedby"], field?.description].filter(Boolean).join(" ") || undefined,
  };
}

// Validation belongs to the form; Field shares its current error, hint and required state with the control.
function Field({ label, htmlFor, help, error, required = false, className, children }: {
  label: React.ReactNode; htmlFor?: string; help?: React.ReactNode; error?: React.ReactNode;
  required?: boolean; className?: string; children: React.ReactNode;
}) {
  const generatedId = React.useId();
  const id = htmlFor ?? generatedId;
  const message = error || help;
  const description = message ? `${id}-description` : undefined;
  return (
    <FieldContext.Provider value={{ id, description, invalid: Boolean(error), required }}>
      <div data-slot="field" data-invalid={error ? true : undefined} className={cn("flex min-w-0 flex-col gap-1.5", className)}>
        <Label htmlFor={id} className="block font-display text-caption leading-normal text-fg-muted">
          {label}
          {required && <><span aria-hidden className="ml-0.5 text-danger">*</span><span className="sr-only"> (required)</span></>}
        </Label>
        {children}
        <p id={`${id}-description`} aria-live="polite" aria-atomic="true" className={cn("text-body-sm leading-snug empty:hidden", error ? "text-danger" : "text-fg-muted")}>{message}</p>
      </div>
    </FieldContext.Provider>
  );
}

export { Field, useFieldControl };

```
