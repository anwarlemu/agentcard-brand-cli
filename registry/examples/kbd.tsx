import { Kbd } from "@/components/ui/kbd";

export function Site() {
  return (
    <p className="flex flex-wrap items-center gap-1.5 text-body-sm text-fg-muted">
      Press <Kbd>⌘</Kbd>
      <Kbd>K</Kbd> to search, or <Kbd>esc</Kbd> to close.
    </p>
  );
}
