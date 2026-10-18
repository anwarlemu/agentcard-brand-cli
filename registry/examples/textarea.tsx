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
