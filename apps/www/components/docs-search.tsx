"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export type SearchEntry = { name: string; title: string; group: string; href: string };

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn("size-3.75 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-width:1.5]", className)}>
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

/**
 * The docs' search, as the guides draw theirs: a 36px bar that opens a palette of every item and page (also on ⌘K).
 * `glass` is the bar on the blue top (dark glass, a faint white rim, the light inner top); `field` the white one on a
 * white page (a pale edge, a faint inner shadow). The palette opens without an animation: it is opened from the
 * keyboard many times a day.
 */
export function DocsSearch({ entries, tone = "field", className }: { entries: SearchEntry[]; tone?: "glass" | "field"; className?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = [...new Set(entries.map((e) => e.group))];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={cn(
          "flex h-9 w-full items-center gap-2.5 rounded-control border pr-3 pl-3.5 text-left text-body-sm outline-none transition-[border-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
          tone === "glass"
            ? "border-line-on-brand bg-glass bg-(image:--ds-glass-sheen) text-fg-on-brand-muted shadow-floating hover:border-line-on-brand-strong focus-visible:outline-white"
            : "border-line-field bg-surface text-fg-muted shadow-inset hover:border-line-field-hover focus-visible:outline-focus-ring",
          className,
        )}
      >
        <SearchIcon />
        <span className="flex-1">Search the library...</span>
        <kbd className={cn("font-display text-caption max-sm:hidden", tone === "glass" ? "text-fg-on-brand-muted" : "text-fg-faint")}>⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search the library" description="Find a component, section, page or visual">
        <CommandInput placeholder="Search the library" />
        <CommandList>
          <CommandEmpty>Nothing matches.</CommandEmpty>
          {groups.map((g) => (
            <CommandGroup key={g} heading={g}>
              {entries
                .filter((e) => e.group === g)
                .map((e) => (
                  <CommandItem
                    key={e.href}
                    value={`${e.title} ${e.name}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(e.href);
                    }}
                  >
                    {e.title}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
        <CommandFooter>
          <span>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to move
          </span>
          <span>
            <Kbd>↵</Kbd> to open
          </span>
          <span className="ml-auto">
            <Kbd>esc</Kbd> to close
          </span>
        </CommandFooter>
      </CommandDialog>
    </>
  );
}
