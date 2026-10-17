import { Pause, Plus, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ACTIONS = [
  { label: "New card", icon: Plus },
  { label: "Pause card", icon: Pause },
  { label: "Card settings", icon: Settings },
];

export function Site() {
  return (
    <TooltipProvider>
    <div className="flex gap-2 pt-10">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" aria-label={label}>
              <Icon strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
    </TooltipProvider>
  );
}

export function Open() {
  return (
    <div className="flex gap-2 pt-10">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" aria-label="Pause card">
            <Pause strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Pause card</TooltipContent>
      </Tooltip>
    </div>
  );
}
