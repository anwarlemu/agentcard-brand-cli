import * as React from "react";

import { cn } from "@/lib/utils";

// The brand's field (the get-started form): square, a 35 percent ink border, 18px Inter, 10px by 12px of padding. Focus
// turns the border blue with a soft blue ring (160ms ease-out); an invalid field's border is red.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-none border border-line-strong bg-surface px-3 py-2.5 font-sans text-h5 leading-snug text-fg transition-[border-color,box-shadow] duration-150 ease-out outline-none placeholder:text-fg-faint focus:border-line-brand focus:shadow-ring-hover disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger file:border-0 file:bg-transparent file:font-display file:text-body-sm file:text-fg motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
