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
