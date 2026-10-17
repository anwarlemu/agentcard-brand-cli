import { Progress } from "@/components/ui/progress";

export function Site() {
  return (
    <div className="grid max-w-md gap-2">
      <div className="flex items-baseline justify-between font-display text-body-sm">
        <span className="text-fg">Spent this month</span>
        <span className="text-fg-muted tabular-nums">$1,240 of $2,000</span>
      </div>
      <Progress value={62} aria-label="Spent this month" />
    </div>
  );
}
