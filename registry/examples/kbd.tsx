import { Kbd } from "@/components/ui/kbd";

// The guides' search footer: keys on the sky strip, each followed by what it does.
export function Site() {
  return (
    <div className="grid max-w-160 gap-6">
      <div className="flex flex-wrap items-center gap-x-4.5 gap-y-2 rounded-control border border-line-window bg-sky px-3.5 py-2 font-display text-micro text-fg-brand">
        <span className="inline-flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd>↵</Kbd> to open
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd>Esc</Kbd> to close
        </span>
      </div>
      <p className="flex flex-wrap items-center gap-1 text-body-sm text-fg-muted">
        Press <Kbd>⌘</Kbd>
        <Kbd>K</Kbd> to search the guides.
      </p>
    </div>
  );
}

// The hint at the end of the guides' search box.
export function Bare() {
  return (
    <div className="flex h-9 max-w-95 items-center gap-2.5 rounded-control border border-line-field bg-surface px-3 text-body-sm text-fg-muted shadow-inset">
      <span className="flex-1">Search...</span>
      <Kbd variant="bare">⌘K</Kbd>
    </div>
  );
}
