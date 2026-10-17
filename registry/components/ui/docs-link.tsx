import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

// A link out to the docs or a guide, as the brand sets links: ink text on a blue underline that turns blue on hover, in
// the 14px display face, and an arrow pointing out that leans a step toward where it goes (150ms ease-out). Opens in a
// new tab.
function DocsLink({ className, children = "Read the docs", ...props }: React.ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      data-slot="docs-link"
      className={cn(
        "group inline-flex w-fit shrink-0 items-center gap-1 font-display text-body-sm whitespace-nowrap text-fg underline decoration-line-brand decoration-1 underline-offset-4 transition-colors duration-150 ease-out outline-none hover:text-fg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowUpRight
        className="size-3.5 shrink-0 transition-[translate] duration-150 ease-out group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none"
        strokeWidth={1.75}
        aria-hidden
      />
    </a>
  );
}

export { DocsLink };
