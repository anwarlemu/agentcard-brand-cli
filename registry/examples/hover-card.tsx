import { CreditCard } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

function AgentPreview() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-control bg-sky text-fg-brand">
          <CreditCard strokeWidth={1.5} className="size-4.5" />
        </span>
        <div>
          <p className="font-display text-body-sm font-medium text-fg">Travel agent</p>
          <p className="text-caption text-fg-muted">3 cards, $250 per purchase</p>
        </div>
      </div>
      <p className="text-body-sm leading-relaxed text-fg-secondary">Books flights and hotels for the team. Last purchase: a train to Boston for $86.40.</p>
    </div>
  );
}

export function Site() {
  return (
    <p className="text-center text-body-sm text-fg-secondary">
      Paid by{" "}
      <HoverCard>
        <HoverCardTrigger href="#travel-agent" className="text-fg-brand underline decoration-line-brand underline-offset-4">
          Travel agent
        </HoverCardTrigger>
        <HoverCardContent>
          <AgentPreview />
        </HoverCardContent>
      </HoverCard>{" "}
      on Oct 21.
    </p>
  );
}

export function Open() {
  return (
    <div className="flex h-60 justify-center">
      <HoverCard defaultOpen>
        <HoverCardTrigger href="#travel-agent" className="h-fit text-body-sm text-fg-brand underline decoration-line-brand underline-offset-4">
          Travel agent
        </HoverCardTrigger>
        <HoverCardContent side="bottom">
          <AgentPreview />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
