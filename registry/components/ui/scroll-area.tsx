"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A scroll area that says when there's more: no scrollbar taking room on one side (so the padding stays even), the
 * content fading out over 24px at whichever edge has more past it (fade-y, tied to the scroll), and while there's more
 * below, a small white key at the bottom that scrolls the rest into view. The key fades and rises in 200ms ease-out.
 */
function ScrollArea({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [below, setBelow] = React.useState(false);

  React.useLayoutEffect(() => {
    const area = ref.current;
    if (!area) return;
    const measure = () => {
      const more = area.scrollHeight > area.clientHeight + 1;
      setBelow(more && area.scrollTop + area.clientHeight < area.scrollHeight - 1);
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

  return (
    <div data-slot="scroll-area" className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={ref}
        data-slot="scroll-area-viewport"
        className={cn("min-h-0 flex-1 overflow-y-auto fade-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
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
          below ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0",
        )}
      >
        <ChevronDown className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export { ScrollArea };
