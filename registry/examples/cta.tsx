import { Cta } from "@/components/site/cta";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/window";

export function Site() {
  return (
    <div className="bg-surface py-16">
      <Cta
        title="Let your agent buy"
        description="Issue a card in minutes and set the limits it spends under."
        actions={
          <Button asChild variant="on-brand">
            <a href="https://app.agentcard.sh/">Get started</a>
          </Button>
        }
      />
    </div>
  );
}

export function WithMedia() {
  return (
    <Cta
      bandFrom="paper"
      bandTo="paper"
      title="Let your agent buy"
      actions={
        <Button asChild variant="on-brand">
          <a href="https://app.agentcard.sh/">Get started</a>
        </Button>
      }
      media={
        <Window name="agent.request" className="mx-auto h-56 max-w-160 text-left shadow-code" bodyClassName="flex items-center justify-center bg-sky-wash font-display text-caption text-fg-label">
          Imagery
        </Window>
      }
    />
  );
}
