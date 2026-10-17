import * as React from "react";

import { cn } from "@/lib/utils";

// The brand's multi-line field: the input's square box, border, 18px type and focus, growing only downward.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full resize-y rounded-none border border-line-strong bg-surface px-3 py-2.5 font-sans text-h5 leading-snug text-fg transition-[border-color,box-shadow] duration-150 ease-out outline-none placeholder:text-fg-faint focus:border-line-brand focus:shadow-ring-hover disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
