import type { ComponentType } from "react";

import { Window } from "@/components/ui/window";
import { Surface } from "@/lib/surface";
import { cn } from "@/lib/utils";

// Each example sits in a window, as the brand frames anything that reads as a small app: the bar names it
// (button.preview), the white body holds it centered, at the line height a site page's body has.
export function Preview({ example: Example, name, label, block = false }: { example: ComponentType; name: string; label: string; surface?: "site"; block?: boolean }) {
  return (
    <figure className="min-w-0">
      <Window name={`${name}.${label.toLowerCase().replaceAll(" ", "-")}`}>
        <Surface className={cn("relative bg-surface leading-normal", block ? "h-180" : "flex min-h-56 items-center justify-center p-6 sm:p-10")}>
          <div className={cn(block ? "h-full w-full" : "w-full max-w-full")}>
            <Example />
          </div>
        </Surface>
      </Window>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
