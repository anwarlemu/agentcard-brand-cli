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
