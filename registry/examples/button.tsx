import { Button } from "@/components/ui/button";
import { Surface } from "@/lib/surface";

export function Site() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Start free</Button>
        <Button variant="secondary">See pricing</Button>
        <Button variant="ghost">Read the docs</Button>
        <Button size="sm">Explore Vault</Button>
      </div>
      <Surface ground="blue" className="flex flex-wrap items-center gap-3 rounded-panel p-8">
        <Button variant="on-brand">Get started</Button>
        <Button variant="on-brand" size="sm">
          Talk to us
        </Button>
      </Surface>
    </div>
  );
}
