# Scroll area
Scrollable container with overflow indicators and a scroll control.

Install: npx agentcard-ds add scroll-area
Requires: theme, utils
Packages: lucide-react
Exports: ScrollArea
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (--bevel-white)


## Usage
Use for a list or log inside a fixed-height window or panel.
- Avoid: Scroll areas inside scroll areas
- Avoid: Hiding the main content in one
- Avoid: Scrolling the whole page in one


## Examples
Example components: npx agentcard-ds add scroll-area window
[Site](https://agentcard-ds.vercel.app/preview/scroll-area/Site)

examples/scroll-area.tsx

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Window } from "@/components/ui/window";

const MERCHANTS = ["Delta", "United", "Marriott", "Hilton", "Airbnb", "Uber", "Lyft", "Amazon", "Notion", "Figma", "Linear", "Vercel", "GitHub", "Slack", "Zoom", "OpenTable"];

export function Site() {
  return (
    <Window name="merchants.list" className="h-72 w-72" bodyClassName="flex flex-col">
      <ScrollArea className="px-4 py-2">
        {MERCHANTS.map((merchant) => (
          <p key={merchant} className="border-b border-line py-2.5 font-display text-body-sm text-fg last:border-b-0">
            {merchant}
          </p>
        ))}
      </ScrollArea>
    </Window>
  );
}

```

## Source

components/ui/scroll-area.tsx

```tsx
"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const EDGE_FADE_PX = 28;

/**
 * A scroll area that says when there's more: no scrollbar taking room on one side (so the padding stays even), the
 * content fading out at whichever edge has more past it, and while there's more below, a small white key at the bottom
 * that scrolls the rest into view. The key fades and rises in 200ms ease-out.
 */
function ScrollArea({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ more: false, above: false, below: false });

  React.useLayoutEffect(() => {
    const area = ref.current;
    if (!area) return;
    const measure = () => {
      const more = area.scrollHeight > area.clientHeight + 1;
      const above = more && area.scrollTop > 1;
      const below = more && area.scrollTop + area.clientHeight < area.scrollHeight - 1;
      setEdges((previous) => (previous.more === more && previous.above === above && previous.below === below ? previous : { more, above, below }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    for (const child of Array.from(area.children)) observer.observe(child);
    area.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      area.removeEventListener("scroll", measure);
    };
  }, []);

  const mask = `linear-gradient(to bottom, ${edges.above ? "transparent" : "black"}, black ${EDGE_FADE_PX}px, black calc(100% - ${EDGE_FADE_PX}px), ${edges.below ? "transparent" : "black"})`;

  return (
    <div data-slot="scroll-area" className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={ref}
        data-slot="scroll-area-viewport"
        className={cn("min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
        style={edges.more ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
        {...props}
      >
        {children}
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => ref.current?.scrollBy({ top: ref.current.clientHeight * 0.8, behavior: "smooth" })}
        className={cn(
          "absolute bottom-1 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-sm border border-hairline bg-surface text-fg-brand shadow-key transition-[opacity,translate,background-color] duration-200 ease-out hover:bg-sky-wash motion-reduce:transition-[opacity]",
          edges.below ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0",
        )}
      >
        <ChevronDown className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export { ScrollArea };

```
