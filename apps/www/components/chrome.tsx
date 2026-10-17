import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

// The docs' own page chrome: a section on the content column, a centered heading as on the brand's pages, and a one-line
// install command with a copy key.
export function SiteSection({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("relative px-5 py-14 sm:px-10 md:py-20", className)} {...props}>
      <div className="mx-auto w-full max-w-(--ds-layout-column)">{children}</div>
    </section>
  );
}

export function SectionHeading({ title, description, align = "center", children, as: Tag = "h2" }: { title: React.ReactNode; description?: React.ReactNode; align?: "center" | "start"; children?: React.ReactNode; as?: "h1" | "h2" }) {
  return (
    <div className={cn("mb-10 flex flex-col gap-3.5", align === "center" ? "items-center text-center" : "items-start")}>
      <Tag className={cn("font-display font-medium text-fg text-balance", Tag === "h1" ? "text-h1 leading-heading tracking-tight" : "text-h2 leading-display tracking-tighter")}>{title}</Tag>
      {description && <p className={cn("max-w-(--ds-layout-heading) text-body-lg leading-snug tracking-tight text-fg-muted", align === "center" && "mx-auto")}>{description}</p>}
      {children}
    </div>
  );
}

export function InstallCommand({ command, className }: { command: string; className?: string }) {
  return (
    <div className={cn("flex w-full max-w-xl items-center gap-3 rounded-control border border-hairline bg-surface py-1.5 pr-1.5 pl-4 shadow-well", className)}>
      <code className="min-w-0 flex-1 truncate font-mono text-body-sm text-fg">{command}</code>
      <CopyButton value={command} label="Copy command" />
    </div>
  );
}
