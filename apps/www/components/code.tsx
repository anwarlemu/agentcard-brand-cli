"use client";

import * as React from "react";

import { WindowBar } from "@/components/ui/window";
import { tokenize } from "@/components/ui/code-window";
import { cn } from "@/lib/utils";

/**
 * Code in a guide's code block (.v7-guide-code): a window with the sky bar (the file name, a small white copy key) over
 * the soft ink ground, code in the system monospace at 14px, comments faint and strings sky. Long files scroll inside a
 * fixed height.
 */
export function Code({ code, title, tall = false, className }: { code: string; title?: string; tall?: boolean; className?: string }) {
  const text = code.trim();
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <figure className={cn("m-0 min-w-0 overflow-hidden rounded-card border border-hairline bg-code-soft shadow-guide", className)}>
      <WindowBar
        name={<figcaption>{title ?? "code"}</figcaption>}
        className="h-9 pr-1.5"
        actions={
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true))}
            className="h-6 rounded-sm border border-hairline bg-surface px-2.5 font-display text-caption leading-none text-fg-brand shadow-key outline-none transition-[background-color,translate] duration-150 ease-out hover:bg-sky-wash focus-visible:outline-2 focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed motion-reduce:transition-none"
          >
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        }
      />
      <pre tabIndex={0} className={cn("m-0 overflow-auto px-4 pt-3.5 pb-4 font-code text-body-sm leading-relaxed whitespace-pre text-white/92 outline-none [scrollbar-width:thin] [tab-size:2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky", tall ? "max-h-140" : "max-h-96")}>
        <code>
          {tokenize(text, "tsx").map((t, i) => (
            <span key={i} className={t.kind === "comment" ? "text-white/45" : t.kind === "string" ? "text-sky" : undefined}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
