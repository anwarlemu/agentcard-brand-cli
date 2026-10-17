import { Eyebrow } from "@/components/site/section";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

export { SectionHeading, SiteSection } from "@/components/site/section";

/**
 * A docs page's opening, as agentcard.sh opens /pricing and /about: the blue eyebrow, the 52px title, a 19px lead at
 * 70 percent ink, then whatever acts on it (the install command). Centered for the index pages, at the start for an
 * item page.
 */
export function PageIntro({ eyebrow, title, lead, align = "center", children, className }: { eyebrow?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode; align?: "center" | "start"; children?: React.ReactNode; className?: string }) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col", centered ? "items-center text-center" : "items-start", className)}>
      {eyebrow && <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>}
      <h1 className="font-display text-h1 leading-heading font-medium tracking-tight text-balance">{title}</h1>
      {lead && <p className={cn("mt-3.5 max-w-(--ds-layout-heading) text-body-lg leading-snug tracking-tight text-pretty text-fg-muted", centered && "mx-auto")}>{lead}</p>}
      {children && <div className={cn("mt-8 w-full", centered && "flex justify-center")}>{children}</div>}
    </div>
  );
}

/** A block of a docs page: its heading (centered as on the brand's pages, or at the start inside an item page), then its content. */
export function Block({ id, title, description, align = "center", children, className }: { id?: string; title: React.ReactNode; description?: React.ReactNode; align?: "center" | "start"; children: React.ReactNode; className?: string }) {
  const centered = align === "center";
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className={cn(centered ? "mx-auto max-w-(--ds-layout-heading) text-center" : "", "mb-8 md:mb-10")}>
        <h2 className={cn("font-display font-medium text-balance", centered ? "text-h2 leading-display tracking-tighter" : "text-h3 leading-display tracking-tight")}>{title}</h2>
        {description && <p className={cn("mt-3 text-pretty text-fg-muted", centered ? "text-body-lg leading-snug tracking-tight" : "text-body")}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** A shell command on the ink ground, as the brand sets code: a sky prompt, the command in the display face, a copy key. */
export function Command({ command, wrap = false, className }: { command: string; wrap?: boolean; className?: string }) {
  return (
    <div className={cn("flex w-full max-w-2xl items-center gap-3 rounded-control bg-code py-1.5 pr-1.5 pl-4 shadow-code", className)}>
      <span aria-hidden className="font-mono text-body-sm text-fg-on-brand-label">
        $
      </span>
      <code className={cn("min-w-0 flex-1 text-left font-mono text-body-sm text-fg-on-brand-muted", wrap ? "break-all whitespace-normal" : "truncate")}>{command}</code>
      <CopyButton value={command} label="Copy command" />
    </div>
  );
}

/** The docs' page column: the content column with room under the header and above the dock. */
export function Page({ className, children }: { className?: string; children: React.ReactNode }) {
  return <main className={cn("mx-auto grid w-(--ds-frame-column) grid-cols-[minmax(0,1fr)] gap-24 pt-28 pb-36 md:gap-28 md:pt-12", className)}>{children}</main>;
}

/** @deprecated The command now sits on the ink ground; kept so older imports read. */
export const InstallCommand = Command;
