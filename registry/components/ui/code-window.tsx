import * as React from "react";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

// Code on the ink ground, as the home page's integrations stage shows it (agentcard.sh, .v7-intg-code): 8px corners,
// a 30px bar with three small squares and the file name, the code in the 12px display face at 88 percent white, and
// the deep drop that lifts it off the blue panel it usually sits on. Highlighting is light on purpose: comments fade,
// strings turn sky, everything else stays one color.

type Token = { text: string; kind: "plain" | "comment" | "string" };

const COMMENT: Record<string, RegExp> = {
  hash: /#[^\n]*/y,
  slash: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y,
  dash: /--[^\n]*/y,
};
const STRING = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/y;

function commentStyle(language?: string) {
  const lang = (language ?? "").toLowerCase();
  if (["sh", "bash", "shell", "zsh", "py", "python", "rb", "ruby", "yaml", "yml", "toml"].includes(lang)) return COMMENT.hash;
  if (["sql", "lua"].includes(lang)) return COMMENT.dash;
  if (["text", "txt", "plain", "http"].includes(lang)) return undefined;
  return COMMENT.slash;
}

/** Splits code into plain runs, comments and strings. Language only picks the comment marker. */
function tokenize(code: string, language?: string): Token[] {
  const comment = commentStyle(language);
  const tokens: Token[] = [];
  let plain = "";
  let i = 0;
  const flush = () => {
    if (plain) tokens.push({ text: plain, kind: "plain" });
    plain = "";
  };
  while (i < code.length) {
    let match: RegExpExecArray | null = null;
    let kind: Token["kind"] = "plain";
    if (comment) {
      comment.lastIndex = i;
      match = comment.exec(code);
      kind = "comment";
    }
    if (!match) {
      STRING.lastIndex = i;
      match = STRING.exec(code);
      kind = "string";
    }
    if (match && match[0].length > 0) {
      flush();
      tokens.push({ text: match[0], kind });
      i += match[0].length;
    } else {
      plain += code[i];
      i += 1;
    }
  }
  flush();
  return tokens;
}

function Highlighted({ code, language }: { code: string; language?: string }) {
  const tokens = React.useMemo(() => tokenize(code, language), [code, language]);
  return (
    <>
      {tokens.map((t, i) =>
        t.kind === "plain" ? (
          <React.Fragment key={i}>{t.text}</React.Fragment>
        ) : (
          <span key={i} className={t.kind === "comment" ? "text-white/45" : "text-sky"}>
            {t.text}
          </span>
        ),
      )}
    </>
  );
}

type CodeWindowProps = Omit<React.ComponentProps<"figure">, "children" | "title"> & {
  /** The file name in the bar (kernel.ts). */
  title?: React.ReactNode;
  /** The code as a string; highlighted lightly and copyable. */
  code?: string;
  /** Pre-rendered code instead of `code` (shown as is, not highlighted). */
  children?: React.ReactNode;
  /** Only picks the comment marker for highlighting (ts, sh, py, sql, text...). */
  language?: string;
  /** Adds a copy key at the right of the bar (needs `code`). */
  copy?: boolean;
  /** Classes for the pre (a fixed height, more bottom room). */
  preClassName?: string;
};

function CodeWindow({ title, code, children, language, copy = false, className, preClassName, ...props }: CodeWindowProps) {
  return (
    <figure data-slot="code-window" className={cn("m-0 flex min-w-0 flex-col overflow-hidden rounded-control bg-code text-white/88 shadow-code", className)} {...props}>
      <div className="flex h-7.5 shrink-0 items-center gap-1.5 border-b border-white/10 px-3 font-sans text-micro leading-4 text-white/55">
        <span aria-hidden className="size-2 rounded-[var(--ds-space-px)] bg-current opacity-45" />
        <span aria-hidden className="size-2 rounded-[var(--ds-space-px)] bg-current opacity-45" />
        <span aria-hidden className="size-2 rounded-[var(--ds-space-px)] bg-current opacity-45" />
        {title ? <figcaption className="ml-2 min-w-0 truncate">{title}</figcaption> : null}
        {copy && code ? <CopyButton value={code} label="Copy code" className="-mr-2 ml-auto size-6 border-transparent bg-transparent text-white/55 shadow-none hover:bg-white/10 hover:text-white data-copied:border-transparent data-copied:bg-white/10 data-copied:text-white data-copied:shadow-none" /> : null}
      </div>
      <pre
        tabIndex={0}
        className={cn(
          "m-0 min-h-0 flex-1 overflow-auto px-4 pt-3.5 pb-4 font-mono text-micro [line-height:1.55] md:text-caption whitespace-pre outline-none [scrollbar-width:thin] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky",
          preClassName,
        )}
      >
        <code className="font-[inherit]">{code !== undefined ? <Highlighted code={code} language={language} /> : children}</code>
      </pre>
    </figure>
  );
}

export { CodeWindow, tokenize };
export type { CodeWindowProps };
