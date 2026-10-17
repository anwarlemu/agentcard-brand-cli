import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

// The docs use the library's own sections; the install command is a one-line field with a copy key.
export { SectionHeading, SiteSection } from "@/components/site/section";

export function InstallCommand({ command, className }: { command: string; className?: string }) {
  return (
    <div className={cn("flex w-full max-w-xl items-center gap-3 rounded-control border border-hairline bg-surface py-1.5 pr-1.5 pl-4 shadow-well", className)}>
      <code className="min-w-0 flex-1 truncate font-mono text-body-sm text-fg">{command}</code>
      <CopyButton value={command} label="Copy command" />
    </div>
  );
}
