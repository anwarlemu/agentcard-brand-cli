import Link from "next/link";

import { Lockup } from "@/components/ui/logo";
import { Scan } from "@/components/visuals/band-divider";
import { DocsSearch, type SearchEntry } from "@www/components/docs-search";
import { cn } from "@/lib/utils";

const KEY = "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-control border px-3.5 font-display text-body-sm leading-none font-medium whitespace-nowrap outline-none transition-[background-color,box-shadow,translate] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px active:shadow-pressed motion-reduce:transition-none motion-reduce:active:translate-y-0";

/**
 * The top of a docs article, as the brand's guides draw theirs (.v7-guide-top): the electric blue under its scan lines,
 * the white lockup, the glass search in the middle, a glass key and the white key at the right, and short stepped
 * bands (5px) down to the white page. On a phone the dock's bar holds the lockup and the menu, so the row keeps the
 * search and the keys under it.
 */
export function DocsTop({ entries, repo }: { entries: SearchEntry[]; repo: string }) {
  return (
    <header className="relative isolate bg-brand text-on-brand max-md:pt-20">
      <Scan sides className="-z-10" />
      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4.5 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)_minmax(0,1fr)] md:gap-6 md:px-7.5">
        <Link href="/" aria-label="Agentcard design system, home" className="justify-self-start rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white max-md:hidden">
          <Lockup tone="white" label={null} className="w-25" />
        </Link>
        <DocsSearch entries={entries} tone="glass" />
        <div className="flex items-center justify-self-end gap-1.5 md:gap-2">
          <a href={repo} className={cn(KEY, "border-line-on-brand bg-glass bg-(image:--ds-glass-sheen) text-white shadow-floating hover:border-line-on-brand-strong focus-visible:outline-white max-md:px-2.5")}>
            GitHub
          </a>
        </div>
      </div>
      <div aria-hidden className="h-5 bg-[linear-gradient(color-mix(in_srgb,var(--ds-color-white)_var(--ds-band-mix-1),var(--ds-color-bg-brand))_0_25%,color-mix(in_srgb,var(--ds-color-white)_var(--ds-band-mix-2),var(--ds-color-bg-brand))_25%_50%,color-mix(in_srgb,var(--ds-color-white)_var(--ds-band-mix-3),var(--ds-color-bg-brand))_50%_75%,color-mix(in_srgb,var(--ds-color-white)_var(--ds-band-mix-4),var(--ds-color-bg-brand))_75%_100%)]" />
    </header>
  );
}

/**
 * The top of a docs index page, as the guides' index draws its own: the lockup at the left, the white key and the blue
 * key at the right, on the white page.
 */
export function DocsHeader({ repo }: { repo: string }) {
  return (
    <header className="flex h-20 items-center justify-between gap-4 px-4.5 md:px-7.5 max-md:hidden">
      <Link href="/" aria-label="Agentcard design system, home" className="rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
        <Lockup tone="ink" label={null} className="w-25" />
      </Link>
      <div className="flex items-center gap-2">
        <a href={repo} className={cn(KEY, "border-hairline bg-surface text-fg shadow-key hover:bg-sky-wash focus-visible:outline-focus-ring")}>
          GitHub
        </a>
      </div>
    </header>
  );
}
