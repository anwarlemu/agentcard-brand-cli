import { Button } from "@/components/ui/button";
import { Surface } from "@/lib/surface";

export function Site() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild><a href="https://app.agentcard.sh/" target="_blank" rel="noreferrer">Start free</a></Button>
        <Button variant="secondary" asChild><a href="https://www.agentcard.sh/pricing" target="_blank" rel="noreferrer">See pricing</a></Button>
        <Button variant="ghost" asChild><a href="https://docs.agentcard.sh" target="_blank" rel="noreferrer">Read the docs</a></Button>
        <Button size="sm" asChild><a href="https://www.agentcard.sh/vault" target="_blank" rel="noreferrer">Explore Vault</a></Button>
      </div>
      <Surface ground="blue" className="flex flex-wrap items-center gap-3 rounded-panel p-8">
        <Button variant="on-brand" asChild><a href="https://app.agentcard.sh/" target="_blank" rel="noreferrer">Get started</a></Button>
        <Button variant="on-brand" size="sm" asChild><a href="https://cal.com/team/agentcard/agentcard-call" target="_blank" rel="noreferrer">Talk to us</a></Button>
      </Surface>
    </div>
  );
}
