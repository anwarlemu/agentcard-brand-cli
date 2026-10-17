"use client";

import { useCopy } from "@/components/ui/copy-button";

export function CodeCopyButton({ text }: { text: string }) {
  const { hasCopied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className="h-6 rounded-sm border border-hairline bg-surface px-2.5 font-display text-caption leading-none text-fg-brand shadow-key outline-none transition-[background-color,translate] duration-150 ease-out hover:bg-sky-wash focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed motion-reduce:transition-none"
    >
      <span aria-live="polite">{hasCopied ? "Copied" : "Copy"}</span>
    </button>
  );
}
