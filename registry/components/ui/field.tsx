import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// A form field as on the get-started form (.v7-gate-field): the label 6px above the input in the 12px display face at 68
// percent ink, a red asterisk when required, and help or an error below in 14px Inter.
function Field({
  label,
  htmlFor,
  help,
  error,
  required = false,
  className,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  help?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-slot="field" data-invalid={error ? true : undefined} className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="block font-display text-caption leading-snug text-fg-muted">
        {label}
        {required && (
          <>
            <span aria-hidden className="ml-0.5 text-danger">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </Label>
      {children}
      {(error || help) && <p className={cn("text-body-sm leading-snug", error ? "text-danger" : "text-fg-muted")}>{error ?? help}</p>}
    </div>
  );
}

export { Field };
