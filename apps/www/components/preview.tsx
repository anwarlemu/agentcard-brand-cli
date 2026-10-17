import type { ComponentType } from "react";

import { Surface } from "@/lib/surface";
import { cn } from "@/lib/utils";

// Each example sits on the paper page in a white frame, at the line height a site page's body has.
export function Preview({ example: Example, surface, label, block = false }: { example: ComponentType; surface: "site" | "product"; label: string; block?: boolean }) {
  return (
    <figure className="min-w-0 rounded-card bg-paper p-2">
      <figcaption className="flex items-center gap-2 px-2 pt-0.5 pb-2 text-caption text-fg-muted">
        <span aria-hidden className={cn("size-1.5 rounded-pill", surface === "product" ? "bg-neutral-50" : "bg-brand")} />
        {label}
      </figcaption>
      <Surface
        className={cn(
          "relative overflow-hidden rounded-card shadow-[0_0_0_1px_var(--ds-color-border-hairline)]",
          block ? "h-180" : "flex min-h-56 items-center justify-center p-6 sm:p-10",
          surface === "product" ? "bg-canvas" : "bg-surface leading-normal",
        )}
      >
        <div className={cn(block ? "h-full w-full" : "w-full max-w-full")}>
          <Example />
        </div>
      </Surface>
    </figure>
  );
}
