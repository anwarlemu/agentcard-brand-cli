import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Surface } from "@/lib/surface";

function Limits({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary">What are limits?</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-2">
        <p className="font-display text-body-sm font-medium text-fg">Spending limits</p>
        <p className="text-body-sm leading-relaxed text-fg-muted">Each card stops at its per purchase and monthly limits, whatever the agent tries to buy.</p>
      </PopoverContent>
    </Popover>
  );
}

export function Site() {
  return <Limits />;
}

export function Open() {
  return (
    <div className="h-48">
      <Limits defaultOpen />
    </div>
  );
}

export function Glass() {
  return (
    <Surface ground="blue" className="h-60 rounded-panel p-8">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="on-brand">About the dock</Button>
        </PopoverTrigger>
        <PopoverContent variant="glass" className="grid gap-1.5">
          <p className="font-display text-body-sm">Always in reach</p>
          <p className="text-body-sm leading-relaxed text-fg-on-brand-muted">The dock floats over every page, so the next step is one tap away.</p>
        </PopoverContent>
      </Popover>
    </Surface>
  );
}
