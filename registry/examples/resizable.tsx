import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const ROWS = [
  { merchant: "Amtrak", amount: "$86.40" },
  { merchant: "Whole Foods", amount: "$112.18" },
  { merchant: "Figma", amount: "$45.00" },
];

export function Site() {
  return (
    <div className="h-80 overflow-hidden rounded-card border border-hairline bg-surface shadow-guide">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={38} minSize={25}>
          <ul className="grid gap-0.5 p-2">
            {ROWS.map((r, i) => (
              <li key={r.merchant} className={i === 0 ? "flex justify-between rounded-control bg-sky-wash px-2.5 py-2 text-body-sm font-medium text-fg-brand" : "flex justify-between rounded-control px-2.5 py-2 text-body-sm text-fg-muted"}>
                <span>{r.merchant}</span>
                <span className="tabular-nums">{r.amount}</span>
              </li>
            ))}
          </ul>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={62} minSize={35}>
          <div className="grid h-full content-start gap-2 p-5">
            <p className="font-display text-h5 font-medium tracking-tight text-fg">Amtrak receipt</p>
            <p className="text-body-sm leading-relaxed text-fg-muted">Two adult fares, Boston to New York, paid by the Travel agent with the card ending 4242.</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="h-80 overflow-hidden rounded-card border border-hairline bg-surface shadow-guide">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={45} minSize={20}>
          <p className="p-5 font-display text-body-sm font-medium text-fg">Spending this week</p>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={55} minSize={20}>
          <p className="p-5 text-body-sm text-fg-muted">Drag the rule, or focus it and use the arrow keys.</p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
