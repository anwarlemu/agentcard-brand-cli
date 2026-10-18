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
