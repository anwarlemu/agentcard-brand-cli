import { BandDivider } from "@/components/visuals/band-divider";

export function Site() {
  return (
    <div className="overflow-hidden rounded-panel border border-hairline">
      <div className="flex h-24 items-end bg-brand p-4 font-display text-caption text-fg-on-brand-label">Blue</div>
      <BandDivider from="blue" to="paper" />
      <div className="flex h-24 items-end bg-paper p-4 font-display text-caption text-fg-label">Paper</div>
      <BandDivider from="paper" to="blue" />
      <div className="flex h-24 items-end bg-brand p-4 font-display text-caption text-fg-on-brand-label">Blue</div>
      <BandDivider from="blue" to="white" grain={false} />
      <div className="flex h-24 items-end bg-surface p-4 font-display text-caption text-fg-label">White, no grain</div>
    </div>
  );
}
