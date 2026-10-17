"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { CopyButton } from "@/components/ui/copy-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const MASK = "••••••••••••";

export const maskSecret = (secret: string, visibleChars: number) => `${secret.slice(0, visibleChars)}${MASK}`;

/**
 * The secret's text, always as wide as its masked form: revealed, the full value truncates into that same space, so
 * showing it never widens the field or the table column around it.
 */
export function SecretText({ secret, masked, isRevealed, className }: { secret: string; masked: string; isRevealed: boolean; className?: string }) {
  return (
    <code className={cn("relative min-w-0 flex-1", className)}>
      <span className={cn("block truncate", isRevealed && "invisible")} aria-hidden={isRevealed}>
        {masked}
      </span>
      {isRevealed && <span className="absolute inset-0 truncate">{secret}</span>}
    </code>
  );
}

// A key or a card number in the guides' search box (.v7-guide-search: white, 8px corners, a 12 percent ink edge with a
// faint inner shadow, 14px text), here 44px tall to hold the brand's small white keys: the value masked to its first
// characters in the display face the brand sets code in, then a show key and a copy key (.v7-command's white key).
function SecretField({
  secret,
  visibleChars = 8,
  label = "key",
  defaultRevealed = false,
  className,
}: {
  secret: string;
  visibleChars?: number;
  label?: string;
  /** Starts with the full secret showing, for the one moment right after it's created. */
  defaultRevealed?: boolean;
  className?: string;
}) {
  const [revealed, setRevealed] = React.useState(defaultRevealed);
  return (
    <div data-slot="secret-field" className={cn("flex h-11 min-w-0 items-center gap-1.5 rounded-control border border-line-field bg-surface pr-1.5 pl-3.5 shadow-inset", className)}>
      <SecretText secret={secret} masked={maskSecret(secret, visibleChars)} isRevealed={revealed} className="font-mono text-body-sm text-fg" />
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? `Hide ${label}` : `Show ${label}`}
            aria-pressed={revealed}
            className="grid size-8 shrink-0 place-items-center rounded-control border border-hairline bg-surface text-fg-brand shadow-key outline-none transition-[background-color,box-shadow,translate] duration-150 ease-out hover:bg-sky-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed motion-reduce:transition-none motion-reduce:active:translate-y-0 [&_svg]:size-3.5"
          >
            {revealed ? <EyeOff strokeWidth={1.5} /> : <Eye strokeWidth={1.5} />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{revealed ? "Hide" : "Show"}</TooltipContent>
      </Tooltip>
      <CopyButton value={secret} label={`Copy ${label}`} />
    </div>
  );
}

export { SecretField };
