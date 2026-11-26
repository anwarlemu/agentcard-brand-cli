# Resizable
Panels split by a 1px ink rule that can be dragged or moved with the arrow keys.

Install: npx agentcard-ds add resizable
Requires: theme, utils
Packages: lucide-react
Exports: ResizableHandle, ResizablePanel, ResizablePanelGroup
Client boundary: yes
Reference: Extrapolated from Agentcard (table.tsx rules, the key)


## Usage
Use in tools where people compare or size panes (a list beside a receipt). Put ResizablePanel items in a ResizablePanelGroup with a ResizableHandle between each; add withHandle when the edge needs to be found.
- Avoid: Resizing as the only way to see content
- Avoid: Handles thicker than the rule
- Avoid: Animating while dragging


## Examples
Example components: npx agentcard-ds add resizable
[Site](https://agentcard-ds.vercel.app/preview/resizable/Site) | [Vertical](https://agentcard-ds.vercel.app/preview/resizable/Vertical)

examples/resizable.tsx

```tsx
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

```

## Source

components/ui/resizable.tsx

```tsx
"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

// Panels with a draggable edge between them, extrapolated from the brand's ruled tables and windows (table.tsx: a 14
// percent ink rule between columns). The handle is that 1px rule with a wide invisible grip, turning blue while dragged
// or focused; with `withHandle` it carries a 12 by 20 white key (a hairline, 6px corners, the key's light top and soft
// drop) with a grip mark. Drag it, or focus it and use the arrow keys (Shift for bigger steps; Home and End go to the
// limits). Sizes are percentages of the group; dragging follows the pointer directly, with no animation.

type Direction = "horizontal" | "vertical";
type PanelInfo = { id: string; defaultSize?: number; minSize: number; maxSize: number; order: number };
type GroupContext = {
  direction: Direction;
  sizes: Record<string, number>;
  register: (info: PanelInfo) => () => void;
  resize: (handleEl: HTMLElement, delta: number) => void;
  set: (handleEl: HTMLElement, to: "min" | "max") => void;
  limits: (handleEl: HTMLElement) => { before?: string; value: number; min: number; max: number };
};

const ResizableContext = React.createContext<GroupContext | null>(null);
const useGroup = () => {
  const ctx = React.useContext(ResizableContext);
  if (!ctx) throw new Error("Resizable parts must be used within a <ResizablePanelGroup />");
  return ctx;
};

function ResizablePanelGroup({ direction = "horizontal", className, onLayout, children, ...props }: Omit<React.ComponentProps<"div">, "dir"> & { direction?: Direction; onLayout?: (sizes: number[]) => void }) {
  const [panels, setPanels] = React.useState<PanelInfo[]>([]);
  const [sizes, setSizes] = React.useState<Record<string, number>>({});
  const group = React.useRef<HTMLDivElement>(null);
  const counter = React.useRef(0);

  const register = React.useCallback((info: PanelInfo) => {
    setPanels((p) => [...p.filter((x) => x.id !== info.id), { ...info, order: counter.current++ }]);
    return () => setPanels((p) => p.filter((x) => x.id !== info.id));
  }, []);

  // Panels without a default size share what the others leave.
  React.useEffect(() => {
    setSizes((current) => {
      const ids = panels.map((p) => p.id);
      if (ids.every((id) => id in current) && Object.keys(current).length === ids.length) return current;
      const fixed = panels.filter((p) => p.defaultSize !== undefined).reduce((s, p) => s + (p.defaultSize ?? 0), 0);
      const free = panels.filter((p) => p.defaultSize === undefined).length;
      return Object.fromEntries(panels.map((p) => [p.id, p.defaultSize ?? Math.max(0, (100 - fixed) / Math.max(1, free))]));
    });
  }, [panels]);

  const ordered = React.useCallback(() => {
    const els = Array.from(group.current?.querySelectorAll<HTMLElement>(":scope > [data-slot=resizable-panel]") ?? []);
    return els.map((el) => el.dataset.panelId!);
  }, []);

  const neighbors = React.useCallback((handleEl: HTMLElement) => {
    let prev = handleEl.previousElementSibling as HTMLElement | null;
    while (prev && prev.dataset.slot !== "resizable-panel") prev = prev.previousElementSibling as HTMLElement | null;
    let next = handleEl.nextElementSibling as HTMLElement | null;
    while (next && next.dataset.slot !== "resizable-panel") next = next.nextElementSibling as HTMLElement | null;
    return [prev?.dataset.panelId, next?.dataset.panelId] as const;
  }, []);

  const info = (id?: string) => panels.find((p) => p.id === id);

  const apply = React.useCallback((a: string, b: string, nextA: number) => {
    setSizes((s) => {
      const pa = panels.find((p) => p.id === a);
      const pb = panels.find((p) => p.id === b);
      if (!pa || !pb) return s;
      const total = s[a] + s[b];
      const lo = Math.max(pa.minSize, total - pb.maxSize);
      const hi = Math.min(pa.maxSize, total - pb.minSize);
      const clamped = Math.min(hi, Math.max(lo, nextA));
      if (clamped === s[a]) return s;
      const out = { ...s, [a]: clamped, [b]: total - clamped };
      onLayout?.(ordered().map((id) => out[id]));
      return out;
    });
  }, [onLayout, ordered, panels]);

  const resize = React.useCallback((handleEl: HTMLElement, delta: number) => {
    const [a, b] = neighbors(handleEl);
    if (a && b) apply(a, b, (sizes[a] ?? 0) + delta);
  }, [apply, neighbors, sizes]);

  const set = React.useCallback((handleEl: HTMLElement, to: "min" | "max") => {
    const [a, b] = neighbors(handleEl);
    if (a && b) apply(a, b, to === "min" ? 0 : 100);
  }, [apply, neighbors]);

  const limits = (handleEl: HTMLElement) => {
    const [a] = neighbors(handleEl);
    const p = info(a);
    return { before: a, value: a ? Math.round(sizes[a] ?? 0) : 0, min: p?.minSize ?? 0, max: p?.maxSize ?? 100 };
  };

  return (
    <ResizableContext.Provider value={{ direction, sizes, register, resize, set, limits }}>
      <div
        ref={group}
        data-slot="resizable-panel-group"
        data-panel-group-direction={direction}
        className={cn("flex h-full w-full", direction === "vertical" && "flex-col", className)}
        {...props}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  );
}

function ResizablePanel({ defaultSize, minSize = 0, maxSize = 100, className, style, id: idProp, ...props }: React.ComponentProps<"div"> & { defaultSize?: number; minSize?: number; maxSize?: number }) {
  const { register, sizes } = useGroup();
  const auto = React.useId();
  const id = idProp ?? auto;
  React.useLayoutEffect(() => register({ id, defaultSize, minSize, maxSize, order: 0 }), [register, id, defaultSize, minSize, maxSize]);
  const size = sizes[id] ?? defaultSize;
  return (
    <div
      data-slot="resizable-panel"
      data-panel-id={id}
      data-panel-size={size === undefined ? undefined : Math.round(size)}
      className={cn("min-h-0 min-w-0 overflow-hidden", className)}
      style={{ flexGrow: size ?? 1, flexShrink: 1, flexBasis: 0, ...style }}
      {...props}
    />
  );
}

function ResizableHandle({ withHandle, className, ...props }: React.ComponentProps<"div"> & { withHandle?: boolean }) {
  const { direction, resize, set, limits } = useGroup();
  const ref = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ start: number; size: number; pointer: number } | null>(null);
  const [, force] = React.useReducer((n: number) => n + 1, 0);
  const vertical = direction === "vertical";
  React.useEffect(() => force(), []);
  const lim = ref.current ? limits(ref.current) : { value: 0, min: 0, max: 100 };

  return (
    <div
      ref={ref}
      role="separator"
      tabIndex={0}
      aria-orientation={vertical ? "horizontal" : "vertical"}
      aria-valuenow={lim.value}
      aria-valuemin={lim.min}
      aria-valuemax={lim.max}
      aria-label="Resize"
      data-slot="resizable-handle"
      data-panel-group-direction={direction}
      className={cn(
        "relative flex shrink-0 touch-none items-center justify-center bg-line outline-none select-none after:absolute focus-visible:bg-line-brand focus-visible:outline-none data-[dragging]:bg-line-brand",
        vertical ? "h-px w-full cursor-row-resize after:inset-x-0 after:-inset-y-1.5" : "w-px cursor-col-resize after:inset-y-0 after:-inset-x-1.5",
        className,
      )}
      onPointerDown={(e) => {
        if (drag.current || e.button !== 0) return;
        const group = ref.current?.parentElement;
        if (!group) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.dataset.dragging = "";
        drag.current = { start: vertical ? e.clientY : e.clientX, size: vertical ? group.clientHeight : group.clientWidth, pointer: e.pointerId };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || e.pointerId !== d.pointer || !ref.current) return;
        const pos = vertical ? e.clientY : e.clientX;
        const delta = ((pos - d.start) / d.size) * 100;
        if (Math.abs(delta) < 0.1) return;
        resize(ref.current, delta);
        d.start = pos;
      }}
      onPointerUp={(e) => {
        drag.current = null;
        delete e.currentTarget.dataset.dragging;
      }}
      onPointerCancel={(e) => {
        drag.current = null;
        delete e.currentTarget.dataset.dragging;
      }}
      onKeyDown={(e) => {
        if (!ref.current) return;
        const step = e.shiftKey ? 10 : 2;
        const back = vertical ? "ArrowUp" : "ArrowLeft";
        const forward = vertical ? "ArrowDown" : "ArrowRight";
        if (e.key === back || e.key === forward) {
          e.preventDefault();
          resize(ref.current, e.key === back ? -step : step);
        } else if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          set(ref.current, e.key === "Home" ? "min" : "max");
        }
      }}
      {...props}
    >
      {withHandle && (
        <div className={cn("z-10 flex items-center justify-center rounded-sm border border-hairline bg-surface text-fg-muted shadow-key", vertical ? "h-3 w-5" : "h-5 w-3")}>
          <GripVertical strokeWidth={1.75} className={cn("size-2.5", vertical && "rotate-90")} />
        </div>
      )}
    </div>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };

```
