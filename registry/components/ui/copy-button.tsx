"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const COPIED_MS = 2000;

/** Copies text and reports it for a moment, so the button can say so. */
export function useCopy() {
  const [hasCopied, setHasCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timeout.current), []);
  const copy = React.useCallback(async (text: string) => {
    clearTimeout(timeout.current);
    setError(null);
    setHasCopied(false);
    try {
      const policy = (document as Document & { permissionsPolicy?: { allowsFeature: (name: string) => boolean }; featurePolicy?: { allowsFeature: (name: string) => boolean } });
      if (navigator.clipboard && (policy.permissionsPolicy ?? policy.featurePolicy)?.allowsFeature("clipboard-write") !== false) {
        await navigator.clipboard.writeText(text);
      } else {
        // Sandboxed previews and older browsers can still copy a user-selected string synchronously.
        const previous = document.activeElement;
        const selection = document.getSelection();
        const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index)) : [];
        const field = document.createElement("textarea");
        field.value = text;
        field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.append(field);
        try {
          field.focus({ preventScroll: true });
          field.select();
          if (!document.execCommand("copy")) throw new Error("Copy unavailable");
        } finally {
          field.remove();
          if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
          selection?.removeAllRanges();
          for (const range of ranges) selection?.addRange(range);
        }
      }
    } catch {
      setError("Copy failed. Try again.");
      return false;
    }
    setHasCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setHasCopied(false), COPIED_MS);
    return true;
  }, []);
  return { hasCopied, error, copy };
}

// A small key that copies (the brand's command key, .v7-command): a 32px white key with the bevel and a clipboard; once
// copied it turns into the blue key for two seconds, the clipboard shrinking away as a tick takes its place (200ms
// ease-out), then turns back. A press sinks it. Reduced motion swaps the marks without moving them.
function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const { hasCopied, error, copy } = useCopy();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-slot="copy-button"
          data-copied={hasCopied || undefined}
          onClick={() => copy(value)}
          aria-label={hasCopied ? "Copied" : error ?? label}
          className={cn(
            "relative grid size-8 shrink-0 place-items-center rounded-control border outline-none transition-[background-color,border-color,box-shadow,color,translate] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed motion-reduce:transition-none motion-reduce:active:translate-y-0 [&_svg]:col-start-1 [&_svg]:row-start-1 [&_svg]:size-3.5 [&_svg]:transition-[opacity,scale] [&_svg]:duration-200 [&_svg]:ease-out motion-reduce:[&_svg]:transition-[opacity]",
            hasCopied ? "border-line-brand-edge bg-primary text-on-primary shadow-key-brand" : "border-hairline bg-surface text-fg-brand shadow-key hover:bg-sky-wash",
            className,
          )}
        >
          <Copy strokeWidth={1.5} className={cn(hasCopied && "scale-60 opacity-0 motion-reduce:scale-100")} />
          <Check strokeWidth={2} className={cn(!hasCopied && "scale-60 opacity-0 motion-reduce:scale-100")} />
        </button>
      </TooltipTrigger>
      <span role="status" className="sr-only">{hasCopied ? "Copied" : error}</span>
      <TooltipContent side="top">{hasCopied ? "Copied" : error ?? label}</TooltipContent>
    </Tooltip>
  );
}

export { CopyButton };
