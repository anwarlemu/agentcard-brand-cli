import { Separator } from "@/components/ui/separator";

export function Site() {
  return (
    <div className="grid max-w-2xl gap-8">
      <div className="grid gap-4">
        <p className="font-display text-caption text-fg-label">Get started</p>
        <h2 className="text-h1 leading-heading">Let your agent buy</h2>
        <p className="text-body-lg text-fg-muted">A few answers, then a call.</p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4 font-display text-body-sm text-fg-muted">
        <span>Vault</span>
        <Separator orientation="vertical" />
        <span>Issuing</span>
        <Separator orientation="vertical" />
        <span>Voice</span>
      </div>
    </div>
  );
}
