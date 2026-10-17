"use client";

import * as React from "react";

import { Window } from "@/components/ui/window";
import { cn } from "@/lib/utils";

/**
 * The page's contents, as the guides draw theirs (.v7-guide-toc): a white window (contents.md) with "On this page" and
 * the sections hung on a thread; the section in view lights the thread blue beside it (color, 160ms ease-out).
 */
export function Contents({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = React.useState(sections[0]?.id);
  React.useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: "0px 0px -65% 0px" },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);
  return (
    <Window name="contents.md" className="shadow-guide">
      <nav aria-label="On this page">
        <p className="mt-3.5 mb-2 flex items-center gap-2 px-4 font-display text-body-sm font-medium text-fg">
          <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current [stroke-linecap:round] [stroke-width:1.5]">
            <path d="M2.5 4h11M2.5 8h8M2.5 12h5" />
          </svg>
          On this page
        </p>
        <ul className="mx-4 mb-4 border-l-[1.5px] border-line">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={cn(
                  "-ml-[1.5px] block border-l-2 border-transparent py-1.25 pl-4 text-body-sm leading-snug text-fg-muted outline-none transition-[border-color,color] duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring motion-reduce:transition-none",
                  active === s.id && "border-line-brand text-fg",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Window>
  );
}
