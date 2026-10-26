import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

/**
 * A page's head, as the brand's guides open an article: the blue display eyebrow, the title in the display face at 500
 * tracked tight, a 19px lead at 68 percent ink, actions at the right, and the guides' rule under it.
 */
export function PageHead({ eyebrow, title, description, actions }: { eyebrow?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <header className="border-b border-line-rule px-4.5 pt-8 pb-7 md:px-10 md:pt-12">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-180">
          {eyebrow && <p className="font-display text-caption tracking-label text-fg-label">{eyebrow}</p>}
          <h1 className="mt-3 font-display text-h2 leading-display font-medium tracking-tight text-pretty">{title}</h1>
          {description && <p className="mt-3.5 text-body-lg leading-normal text-fg-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-4 font-display text-body-sm">{actions}</div>}
      </div>
    </header>
  );
}

/** The page's body beside the rail, with the guides' column and gutters. */
export function PageBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-14 px-4.5 pt-10 pb-24 md:px-10", className)}>{children}</div>;
}

/** A section of a page, as the guides set theirs: a 24px display heading, an optional line under it, then the content. */
export function Block({ id, title, description, children, className }: { id?: string; title: React.ReactNode; description?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("grid min-w-0 scroll-mt-20 grid-cols-[minmax(0,1fr)] gap-5", className)}>
      <div>
        <h2 className="font-display text-h3 leading-display font-medium tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-body text-fg-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** A shell command on the ink ground, as the brand sets code: a sky prompt, the command in the display face, a copy key. */
export function Command({ command, wrap = false, className }: { command: string; wrap?: boolean; className?: string }) {
  return (
    <div className={cn("flex w-full min-w-0 items-center gap-3 rounded-control bg-code py-1.5 pr-1.5 pl-4 shadow-code", className)}>
      <span aria-hidden className="font-mono text-body-sm text-fg-on-brand-label">
        $
      </span>
      <code className={cn("min-w-0 flex-1 text-left font-mono text-body-sm text-fg-on-brand-muted", wrap ? "break-all whitespace-normal" : "truncate")}>{command}</code>
      <CopyButton value={command} label="Copy command" />
    </div>
  );
}
