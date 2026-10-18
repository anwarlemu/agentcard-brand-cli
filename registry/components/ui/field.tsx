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
