import { Lockup } from "@/components/ui/logo";
import { Scan } from "@/components/visuals/band-divider";
import { CopyButton } from "@/components/ui/copy-button";

/**
 * The aside's call to action, as the guides' (.v7-guide-cta): the blue panel under its scan lines with the lockup, and
 * a white card inside it with a 16px display title, a 12px line, and the keys.
 */
export function CtaCard({ command }: { command: string }) {
  return (
    <aside className="relative isolate overflow-hidden rounded-shell bg-brand px-2 pb-2">
      <Scan sides className="-z-10" />
      <Lockup tone="white" label={null} className="mt-3.5 mb-3 ml-2.5 w-20" />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-2 rounded-card border border-line-rule bg-surface px-3 pt-3.5 pb-3 text-fg shadow-tile">
        <p className="font-display text-body leading-snug font-medium tracking-tight">Add this component</p>
        <p className="mb-1 text-caption leading-normal text-fg-muted">
          Run this in the project to copy the component, its dependencies and the theme.
        </p>
        <div className="flex items-center gap-2 rounded-sm bg-code py-1 pr-1 pl-2.5">
          <code className="min-w-0 flex-1 truncate font-code text-micro text-fg-on-brand-muted">{command}</code>
          <CopyButton value={command} label="Copy command" className="size-6" />
        </div>
      </div>
    </aside>
  );
}
