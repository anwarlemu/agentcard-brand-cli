"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Lockup } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export type RailGroup = { label: string; items: { name: string; title: string }[] };

// A row of the rail, as the guides' nav draws one: 14px at 68 percent ink in an 8px-cornered row, a 4 percent wash on
// hover; the current page is the pale sky row with blue text at 500. Color only, no motion.
const ROW =
  "flex min-h-8.5 items-center rounded-control px-2.5 py-1.5 text-body-sm leading-snug text-fg-muted outline-none transition-[background-color,color] duration-150 ease-out hover:bg-wash-hover hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-[current=page]:bg-sky-wash aria-[current=page]:font-medium aria-[current=page]:text-fg-brand motion-reduce:transition-none";
const HEADING = "mb-1.5 px-2.5 font-display text-caption tracking-label text-fg-label";

const PAGES = [
  { href: "/", label: "Introduction" },
  { href: "/components", label: "All components" },
  { href: "/theme", label: "Theme" },
];

function List({ groups, query, onNavigate }: { groups: RailGroup[]; query: string; onNavigate: () => void }) {
  const pathname = usePathname();
  const q = query.trim().toLowerCase();
  const shown = groups.map((g) => ({ ...g, items: q ? g.items.filter((i) => i.title.toLowerCase().includes(q) || i.name.includes(q)) : g.items })).filter((g) => g.items.length);
  return (
    <>
      {!q && (
        <div>
          <p className={HEADING}>Docs</p>
          <ul className="grid gap-0.5">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} onNavigate={onNavigate} aria-current={pathname === p.href ? "page" : undefined} className={ROW}>
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {shown.length ? (
        shown.map((g) => (
          <div key={g.label}>
            <p className={HEADING}>{g.label}</p>
            <ul className="grid gap-0.5">
              {g.items.map((i) => {
                const href = `/components/${i.name}`;
                return (
                  <li key={i.name}>
                    <Link href={href} scroll={false} onNavigate={onNavigate} data-item={i.name} aria-current={pathname === href ? "page" : undefined} className={ROW}>
                      {i.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <p className="px-2.5 text-body-sm text-fg-muted">Nothing matches.</p>
      )}
    </>
  );
}

/**
 * The docs' rail, drawn as the brand's guides draw their library panel: white with the hairline at its edge, the blue
 * lockup, the guides' search box as the filter, the docs pages and every item grouped A to Z under blue display labels,
 * and the brand's links at the foot. From 1024px it stays beside the page and scrolls inside; below, a white bar with
 * the lockup and a white key opens it over the page and it closes after a choice. It lives in the shared layout, so
 * it keeps its scroll and filter between pages.
 */
export function DocsRail({ groups, repo, site }: { groups: RailGroup[]; repo: string; site: string }) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hairline bg-surface px-4.5 lg:hidden">
        <Link href="/" aria-label="Agentcard design system, home" className="rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
          <Lockup tone="brand" label={null} className="w-24" />
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="docs-rail"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-9 items-center gap-1.5 rounded-control border border-hairline bg-surface px-3 font-display text-body-sm leading-none font-medium text-fg shadow-key outline-none transition-[background-color] duration-150 ease-out hover:bg-sky-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none"
        >
          {open ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
          <span className="sr-only">{open ? "Close the library" : "Open the library"}</span>
          <span aria-hidden>{open ? "Close" : "Library"}</span>
        </button>
      </div>
      <nav
        id="docs-rail"
        aria-label="Library"
        className={cn(
          "z-20 flex-col border-r border-hairline bg-surface max-lg:fixed max-lg:inset-x-0 max-lg:top-14 max-lg:bottom-0 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-72 lg:shrink-0",
          open ? "flex" : "hidden",
        )}
      >
        <Link href="/" aria-label="Agentcard design system, home" className="mx-5 mt-6 mb-5 hidden w-fit rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring lg:block">
          <Lockup tone="brand" label={null} className="w-28" />
        </Link>
        <div className="mx-3.5 mt-4 mb-4 lg:mt-0">
          <Input variant="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter components" aria-label="Filter components" />
        </div>
        <div data-rail-scroll="" className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto overscroll-contain px-3.5 pb-6 [scrollbar-width:thin]">
          <List groups={groups} query={query} onNavigate={close} />
        </div>
        <div className="flex items-center gap-4 border-t border-line-subtle px-6 py-3.5 font-display text-caption">
          <a href={repo} className="rounded-sm text-fg-muted outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring motion-reduce:transition-none">
            GitHub
          </a>
          <a href={site} className="rounded-sm text-fg-muted outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring motion-reduce:transition-none">
            agentcard.sh
          </a>
        </div>
      </nav>
    </>
  );
}
