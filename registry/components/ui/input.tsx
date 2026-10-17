import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Two fields. `field` is the form's (the get-started form): square, a 35 percent ink border, 18px Inter, 10px by 12px
// of padding; focus turns the border blue with a soft blue ring, an invalid field's border is red. `search` is the
// guides' search box: 36px, 8px corners, a 12 percent ink edge that darkens under the pointer, white with a faint inner
// shadow, 14px text, a search icon at the left; focus is the blue outline.
const inputVariants = cva(
  "flex w-full min-w-0 bg-surface text-fg outline-none transition-[border-color,box-shadow] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        field:
          "rounded-none border border-line-strong px-3 py-2.5 font-sans text-h5 leading-snug placeholder:text-fg-faint focus:border-line-brand focus:shadow-ring-hover aria-invalid:border-danger file:border-0 file:bg-transparent file:font-display file:text-body-sm file:text-fg",
        search:
          "h-9 rounded-control border border-line-field pr-3 pl-9 font-sans text-body-sm shadow-inset placeholder:text-fg-muted hover:border-line-field-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring [&::-webkit-search-cancel-button]:hidden",
      },
    },
    defaultVariants: { variant: "field" },
  },
);

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 fill-none stroke-current text-fg-muted [stroke-linecap:round] [stroke-width:1.5]">
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

function Input({ className, type, variant, ...props }: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  const input = <input type={variant === "search" ? (type ?? "search") : type} data-slot="input" className={cn(inputVariants({ variant }), variant !== "search" && className)} {...props} />;
  if (variant !== "search") return input;
  return (
    <div data-slot="search" className={cn("relative w-full", className)}>
      <SearchIcon />
      {input}
    </div>
  );
}

export { Input, inputVariants };
