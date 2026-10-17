import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

// Code in the brand's window: an ink ground, code in the display face, a copy key in the bar. Long files scroll inside
// a fixed height.
export function Code({ code, title, tall = false, className }: { code: string; title?: string; tall?: boolean; className?: string }) {
  const text = code.trim();
  return (
    <figure className={cn("overflow-hidden rounded-control bg-code shadow-code", className)}>
      <figcaption className="flex h-10 items-center justify-between gap-3 border-b border-line-on-brand pr-1.5 pl-4 font-display text-caption text-fg-on-brand-muted">
        <span>{title ?? "code"}</span>
        <CopyButton value={text} label="Copy code" />
      </figcaption>
      <div className={cn("overflow-auto", tall ? "max-h-140" : "max-h-96")}>
        <pre className="w-max min-w-full p-4 font-mono text-caption leading-code text-fg-on-brand-muted">{text}</pre>
      </div>
    </figure>
  );
}
