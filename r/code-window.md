# Code window
Code block with a filename, highlighting and optional copy action.

Install: npx agentcard-ds add code-window
Requires: theme, copy-button, utils
Packages: none
Exports: CodeWindow, tokenize, CodeWindowProps
Client boundary: not required by this entry file
Reference: agentcard-website src/components/v7/integrations.tsx (CodePane), src/app/globals.css:3341 (.v7-intg-code); agentcard.sh / (computed: .v7-intg-stage [class*=code])


## Usage
Use for commands, integration examples and API requests. Pass code as a string for highlighting and copying, or pass rendered children.
- Avoid: A full syntax theme with many colors
- Avoid: A light code window
- Avoid: Rounded corners above 8px
- Avoid: Code set in a monospace other than the display face
`CodeWindow` props: `title` (the file name in the bar), `code` (string) or `children`, `language` (only picks the comment
marker for highlighting: `ts`, `sh`, `py`, `sql`, `text`...), `copy` (adds the copy key; needs `code`), `preClassName`
(a fixed height or the home stage's 60px of bottom room, `pb-15`). It also exports `tokenize(code, language)`.

On the brand's page the window sits at 88 percent of a blue panel (`bg-brand`, 12px corners, 32px padding). The site
has no separate terminal style live (the guides are not published), so there is no `Terminal` export: use a code window
titled `Terminal` with `language="sh"`.

## Examples
Example components: npx agentcard-ds add code-window
[Site](https://agentcard-ds.vercel.app/preview/code-window/Site) | [Request](https://agentcard-ds.vercel.app/preview/code-window/Request)

examples/code-window.tsx

```tsx
import { CodeWindow } from "@/components/ui/code-window";

const KERNEL = `// One card item per purchase, in the
// user's KERNEL vault
await kernel.vaults.items.upsert('order', {
  type: 'card',
  spec: { provider: 'agentcard',
    merchant: 'amazon.com',
    amount: 2306, currency: 'usd' },
});
const browser = await kernel.browsers.create({
  vaults: [{ id: vault.id }],
});`;

const LINQ = `POST api.linqapp.com/…/v3/payments

{ "handle": "+1 415 555 0134",
  "amount": 2306,
  "merchant": "amazon.com" }`;

// On the blue panel, as on the home page's integrations stage.
export function Site() {
  return (
    <div className="mx-auto flex min-h-105 max-w-162 items-center rounded-panel bg-brand p-[clamp(var(--ds-space-4),2.4vw,var(--ds-space-8))]">
      <CodeWindow title="kernel.ts" language="ts" code={KERNEL} copy className="w-full sm:w-[88%]" preClassName="pb-15" />
    </div>
  );
}

// On white, with a copy key and a request instead of code.
export function Request() {
  return <CodeWindow title="payments.http" language="http" code={LINQ} copy className="max-w-xl" />;
}

```

## Source

components/ui/code-window.tsx

```tsx
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

```
