import { CopyButton } from "@/components/ui/copy-button";

export function Site() {
  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-control border border-hairline bg-surface py-2 pr-2 pl-4 shadow-key">
      <span aria-hidden className="font-mono text-body text-fg-brand opacity-45">
        $
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-body text-fg">npx agent-cards companies wizard</code>
      <CopyButton value="npx agent-cards companies wizard" label="Copy command" />
    </div>
  );
}
