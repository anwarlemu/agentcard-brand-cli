"use client";

import * as React from "react";

import { tokenize } from "@/components/ui/code-window";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

// shadcn's CodeBlock in the look of the brand's code window (agentcard.sh, the integrations stage, .v7-intg-code): the
// ink ground with 8px corners and the deep drop, a 30px bar with three small squares, the file name and a copy key, then
// the code in the 12px display face at 88 percent white on a 1.55 line. Highlighting is light on purpose, as on the
// window: comments fade to 45 percent, strings turn sky, everything else stays one color. Line numbers sit at 30
// percent white. Long lines scroll, or wrap with `wrap`; `maxHeight` classes scroll a long file inside the block.
function CodeBlock({ className, ...props }: React.ComponentProps<"figure">) {
  return <figure data-slot="code-block" className={cn("group/code-block m-0 flex w-full min-w-0 flex-col overflow-hidden rounded-control bg-code text-white/88 shadow-code", className)} {...props} />;
}

/** The bar: three small squares at the left, then the title and the actions. */
function CodeBlockHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="code-block-header" className={cn("flex h-7.5 min-w-0 shrink-0 items-center gap-1.5 border-b border-white/10 px-3 font-sans text-micro leading-4 text-white/55", className)} {...props}>
      <span aria-hidden className="size-2 shrink-0 rounded-[var(--ds-space-px)] bg-current opacity-45" />
      <span aria-hidden className="size-2 shrink-0 rounded-[var(--ds-space-px)] bg-current opacity-45" />
      <span aria-hidden className="size-2 shrink-0 rounded-[var(--ds-space-px)] bg-current opacity-45" />
      {children}
    </div>
  );
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"figcaption">) {
  return <figcaption data-slot="code-block-title" className={cn("ml-2 min-w-0 truncate", className)} {...props} />;
}

function CodeBlockActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="code-block-actions" className={cn("-mr-2 ml-auto flex shrink-0 items-center gap-1", className)} {...props} />;
}

/** The window's copy key, quiet on the ink: no edge or fill until the pointer is on it. */
function CodeBlockCopyButton({ value, label = "Copy code", className }: { value: string; label?: string; className?: string }) {
  return (
    <CopyButton
      value={value}
      label={label}
      className={cn("size-6 border-transparent bg-transparent text-white/55 shadow-none hover:bg-white/10 hover:text-white data-copied:border-transparent data-copied:bg-white/10 data-copied:text-white data-copied:shadow-none", className)}
    />
  );
}

/**
 * The code itself. Pass the text as `code` and its `language` (it only picks the comment marker: ts, sh, py, sql...);
 * line numbers show by default. `wrap` breaks long lines instead of scrolling.
 */
function CodeBlockContent({ code, language, lineNumbers = true, wrap = false, className, ...props }: Omit<React.ComponentProps<"pre">, "children"> & { code: string; language?: string; lineNumbers?: boolean; wrap?: boolean }) {
  const lines = React.useMemo(() => {
    const rows: { kind: "plain" | "comment" | "string"; text: string }[][] = [[]];
    for (const token of tokenize(code.replace(/\n$/, ""), language)) {
      token.text.split("\n").forEach((part, i) => {
        if (i > 0) rows.push([]);
        if (part) rows[rows.length - 1].push({ kind: token.kind, text: part });
      });
    }
    return rows;
  }, [code, language]);
  return (
    <pre
      data-slot="code-block-content"
      tabIndex={0}
      className={cn(
        "m-0 min-h-0 flex-1 overflow-auto pt-3.5 pb-4 font-mono text-micro [line-height:1.55] outline-none [scrollbar-width:thin] [tab-size:2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky md:text-caption",
        className,
      )}
      {...props}
    >
      <code className={cn("grid font-[inherit]", wrap ? "grid-cols-[minmax(0,1fr)]" : "min-w-max")}>
        {lines.map((line, i) => (
          <span key={i} className={cn("grid", lineNumbers ? "grid-cols-[2.75rem_minmax(0,1fr)]" : "grid-cols-[minmax(0,1fr)] pl-4")}>
            {lineNumbers && (
              <span aria-hidden className="pr-3.5 text-right text-white/30 select-none">
                {i + 1}
              </span>
            )}
            <span className={cn("pr-4", wrap ? "whitespace-pre-wrap [overflow-wrap:anywhere]" : "whitespace-pre")}>
              {line.length
                ? line.map((t, j) =>
                    t.kind === "plain" ? (
                      <React.Fragment key={j}>{t.text}</React.Fragment>
                    ) : (
                      <span key={j} className={t.kind === "comment" ? "text-white/45" : "text-sky"}>
                        {t.text}
                      </span>
                    ),
                  )
                : "​"}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}

export { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle };
