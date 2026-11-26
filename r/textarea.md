# Textarea
Resizable multi-line text field.

Install: npx agentcard-ds add textarea
Requires: theme, field, utils
Packages: none
Exports: Textarea
Client boundary: yes
Reference: Published CSS on https://agentcard.com/get-started (.v7-gate-field textarea); the current visible form has no textarea


## Usage
Use inside Field for messages, notes and other longer input. Connect value and onChange when the form owns the state.
- Avoid: Rounded corners
- Avoid: Gray fills
- Avoid: Resizing sideways


## Examples
Example components: npx agentcard-ds add textarea button field
[Site](https://agentcard-ds.vercel.app/preview/textarea/Site) | [States](https://agentcard-ds.vercel.app/preview/textarea/States)

examples/textarea.tsx

```tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function Site() {
  const [brief, setBrief] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState("");
  const error = submitted && !brief.trim() ? "Enter what your agent should buy." : undefined;
  return <form noValidate className="grid max-w-170 gap-4" onSubmit={(event) => {
    event.preventDefault();
    setSubmitted(true);
    setSaved(brief.trim() ? brief.trim() : "");
  }} onReset={() => { setBrief(""); setSubmitted(false); setSaved(""); }}>
    <Field label="What should your agent buy?" htmlFor="textarea-brief" required error={error} help={`${brief.length}/500 characters`}>
      <Textarea id="textarea-brief" name="brief" value={brief} maxLength={500}
        onChange={(event) => { setBrief(event.target.value); setSaved(""); }}
        placeholder="Book flights and hotels for the sales team" />
    </Field>
    <div className="flex gap-3">
      <Button type="submit">Save brief</Button>
      <Button type="reset" variant="secondary">Reset</Button>
    </div>
    <p role="status" className="text-body-sm text-fg-muted">{saved ? `Saved: ${saved}` : ""}</p>
  </form>;
}

export function States() {
  return <div className="grid max-w-170 gap-4">
    <Field label="Purchase notes" htmlFor="textarea-notes" help="Four rows; resize vertically for longer notes.">
      <Textarea id="textarea-notes" rows={4} defaultValue={"Buy two train tickets.\nKeep the total under $200."} />
    </Field>
    <Field label="Read-only brief" htmlFor="textarea-readonly">
      <Textarea id="textarea-readonly" readOnly value="Book a meeting room for six people." />
    </Field>
    <Field label="Unavailable brief" htmlFor="textarea-disabled">
      <Textarea id="textarea-disabled" disabled placeholder="Select an agent first" />
    </Field>
  </div>;
}

```

## Source

components/ui/textarea.tsx

```tsx
"use client";

import * as React from "react";

import { useFieldControl } from "@/components/ui/field";
import { cn } from "@/lib/utils";

// The brand's multi-line field (the get-started form, .v7-gate-field textarea): the input's square box, 35 percent ink
// border, 18px Inter and 10px by 12px of padding, at least 84px tall and growing only downward; focus is the form's 2px
// blue outline laid over the border.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "block min-h-21 min-w-0 w-full resize-y rounded-none border border-line-strong bg-surface px-3 py-2.5 font-sans text-h5 leading-snug text-fg outline-none placeholder:text-fg/50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger",
        className,
      )}
      {...useFieldControl(props)}
    />
  );
}

export { Textarea };

```
