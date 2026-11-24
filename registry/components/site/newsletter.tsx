"use client";

import * as React from "react";

import { SectionHeading, SiteSection, type SectionGround } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// A sign-up band built from the get-started form's field and the blue key (the site's own form parts). The form is
// yours: pass onSubmit, which gets the address; the component keeps only the field's value and its sent state.

function Newsletter({
  title,
  description,
  label = "Email",
  action = "Subscribe",
  done,
  ground = "white",
  onSubmit,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  label?: string;
  action?: React.ReactNode;
  /** Shown in place of the form once onSubmit resolves. */
  done?: React.ReactNode;
  ground?: SectionGround;
  onSubmit: (email: string) => void | Promise<void>;
}) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const id = React.useId();
  return (
    <SiteSection ground={ground}>
      <SectionHeading title={title} description={description} />
      {state === "sent" && done ? (
        <p role="status" className="mx-auto mt-8 max-w-120 text-center text-body-lg">{done}</p>
      ) : (
        <form
          className="mx-auto mt-8 flex max-w-120 flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setState("sending");
            try {
              await onSubmit(email);
              setState("sent");
            } catch {
              setState("error");
            }
          }}
        >
          <label htmlFor={id} className="sr-only">{label}</label>
          <Input id={id} type="email" required autoComplete="email" placeholder={label} value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state === "error" || undefined} className="flex-1" />
          <Button type="submit" variant={ground === "blue" ? "on-brand" : "primary"} disabled={state === "sending"}>
            {action}
          </Button>
        </form>
      )}
    </SiteSection>
  );
}

export { Newsletter };
