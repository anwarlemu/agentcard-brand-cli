import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import type { GalleryEntry } from "@www/lib/gallery";

/** One generated picture on its card: the picture at its own aspect, what it is, and the command, copyable. */
export function Shot({ entry, className, command = true, fit = false }: { entry: GalleryEntry; className?: string; command?: boolean; fit?: boolean }) {
  return (
    <figure className={cn("flex min-w-0 flex-col overflow-hidden rounded-card border border-hairline bg-surface shadow-tile", className)}>
      <div className={cn("border-b border-line-subtle bg-paper", fit && "relative aspect-square")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={entry.file} alt={entry.title} width={entry.width} height={entry.height} loading="lazy" className={cn("block w-full", fit ? "absolute inset-0 h-full object-contain p-3" : "h-auto")} />
      </div>
      <figcaption className="flex min-w-0 items-center gap-2 px-3 py-2">
        <span className="min-w-0 flex-1 truncate text-caption text-fg-muted">{entry.title}</span>
        {command && <CopyButton value={entry.command} label={`Copy the command for ${entry.title}`} />}
      </figcaption>
    </figure>
  );
}
