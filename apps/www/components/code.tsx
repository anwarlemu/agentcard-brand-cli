import { WindowBar } from "@/components/ui/window";
import { tokenize } from "@/components/ui/code-window";
import { CodeCopyButton } from "@www/components/code-copy-button";
import { cn } from "@/lib/utils";

/**
 * Code in a guide's code block (.v7-guide-code): a window with the sky bar (the file name, a small white copy key) over
 * the soft ink ground, code in the system monospace at 14px, comments faint and strings sky. Long files scroll inside a
 * fixed height.
 */
export function Code({ code, title, lang = "tsx", tall = false, className }: { code: string; title?: string; lang?: string; tall?: boolean; className?: string }) {
  const text = code.trim();
  return (
    <figure className={cn("m-0 min-w-0 overflow-hidden rounded-card border border-hairline bg-code-soft shadow-guide", className)}>
      <WindowBar
        name={<figcaption>{title ?? "code"}</figcaption>}
        className="h-9 pr-1.5"
        actions={<CodeCopyButton text={text} />}
      />
      <pre tabIndex={0} className={cn("m-0 overflow-auto px-4 pt-3.5 pb-4 font-code text-body-sm leading-relaxed whitespace-pre text-white/92 outline-none [scrollbar-width:thin] [tab-size:2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky", tall ? "max-h-140" : "max-h-96")}>
        <code>
          {tokenize(text, lang).map((t, i) => (
            <span key={i} className={t.kind === "comment" ? "text-white/45" : t.kind === "string" ? "text-sky" : undefined}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
