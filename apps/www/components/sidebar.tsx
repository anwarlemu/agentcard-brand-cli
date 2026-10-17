"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { WindowBar, WindowMark } from "@/components/ui/window";
import { cn } from "@/lib/utils";

type Group = { label: string; items: { name: string; title: string }[] };

// A row of the list, as the guides' nav draws one: 14px Inter at 68 percent ink in an 8px-cornered row, a 4 percent
// wash on hover; the current page is the pale sky row with blue text at 500.
const LINK =
  "block rounded-control px-2.5 py-1.5 text-body-sm leading-snug text-fg-muted outline-none transition-[background-color,color] duration-150 ease-out hover:bg-wash-hover hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-[current=page]:bg-sky-wash aria-[current=page]:font-medium aria-[current=page]:text-fg-brand motion-reduce:transition-none";

function useCurrent() {
  const pathname = usePathname();
  return pathname.startsWith("/components/") ? pathname.slice("/components/".length) : undefined;
}

function Groups({ groups, current, query, onNavigate }: { groups: Group[]; current?: string; query: string; onNavigate: () => void }) {
  const q = query.trim().toLowerCase();
  const shown = groups.map((g) => ({ ...g, items: q ? g.items.filter((i) => i.title.toLowerCase().includes(q) || i.name.includes(q)) : g.items })).filter((g) => g.items.length);
  if (!shown.length) return <p className="px-2.5 text-body-sm text-fg-muted">Nothing matches.</p>;
  return (
    <>
      {shown.map((g) => (
        <div key={g.label} className="border-line [&+&]:border-t [&+&]:pt-4">
          <p className="mb-1.5 px-2.5 font-display text-body-sm font-medium text-fg">{g.label}</p>
          <ul className="grid gap-0.5">
            {g.items.map((i) => (
              <li key={i.name}>
                <Link href={`/components/${i.name}`} scroll={false} onNavigate={onNavigate} aria-current={i.name === current ? "page" : undefined} data-item={i.name} className={LINK}>
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

/**
 * The library's panel, as the guides' nav (.v7-guide-nav): a white window with the sky bar (library.dir), the filter,
 * then the groups ruled apart. From 1024px it sticks beside the page and scrolls inside; below, it closes to its bar
 * over the page, which opens it.
 */
export function LibraryNav({ groups }: { groups: Group[] }) {
  const current = useCurrent();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // The shared layout owns this list: route changes must preserve its scroll and filter.

  return (
    <nav aria-label="Library" data-open={open || undefined} className="group/nav overflow-hidden rounded-card border border-hairline bg-surface shadow-guide lg:sticky lg:top-6">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="block w-full text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring lg:pointer-events-none">
        <WindowBar name="library.dir" className="max-lg:group-not-data-open/nav:border-b-transparent" actions={
            <>
              <span className="font-display text-caption text-fg lg:hidden">{open ? "Close" : "Browse the library"}</span>
              <WindowMark className="max-lg:hidden" />
            </>
          } />
      </button>
      <div className={cn("grid gap-4.5 px-2.5 pt-3.5 pb-4 lg:max-h-[calc(100svh-var(--spacing)*20)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-width:none]", !open && "max-lg:hidden")}>
        <Input variant="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter the library" aria-label="Filter the library" />
        <Groups groups={groups} current={current} query={query} onNavigate={() => setOpen(false)} />
      </div>
    </nav>
  );
}
