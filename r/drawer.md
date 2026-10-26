# Drawer
A panel pulled from an edge: the brand's white window with a grab handle, dragged away or flicked shut.

Install: npx agentcard-ds add drawer
Requires: theme, surface, utils
Packages: @radix-ui/react-dialog
Exports: Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger
Client boundary: yes
Reference: Extrapolated from Agentcard (the sheet window, the ink scrim)


## Usage
Use on phones for a short task tied to the page: choosing a card, reviewing a purchase. Set direction (bottom by default). Put the title in DrawerHeader and the actions in DrawerFooter. Mark scrolling areas inside with data-drawer-no-drag.
- Avoid: A drawer for long forms
- Avoid: Two drawers at once
- Avoid: Dragging that fights a scrolling list


## Examples
Example components: npx agentcard-ds add drawer button
[Site](https://agentcard-ds.vercel.app/preview/drawer/Site) | [Directions](https://agentcard-ds.vercel.app/preview/drawer/Directions) | [Open](https://agentcard-ds.vercel.app/preview/drawer/Open)

examples/drawer.tsx

```tsx
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const CARDS = [
  { id: "travel", name: "Travel agent", limit: "$250 per purchase" },
  { id: "groceries", name: "Groceries agent", limit: "$120 per purchase" },
  { id: "software", name: "Software agent", limit: "$60 per purchase" },
];

function ChooseCard({ defaultOpen = false, direction }: { defaultOpen?: boolean; direction?: "bottom" | "top" | "left" | "right" }) {
  const [open, setOpen] = useState(defaultOpen);
  const [card, setCard] = useState("travel");
  const chosen = CARDS.find((c) => c.id === card)!;
  return (
    <div className="grid justify-items-center gap-3">
      <Drawer open={open} onOpenChange={setOpen} direction={direction}>
        <DrawerTrigger asChild>
          <Button variant="secondary">Choose a card</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Pay with which card?</DrawerTitle>
            <DrawerDescription>The agent uses this card for the checkout it is on now.</DrawerDescription>
          </DrawerHeader>
          <div role="radiogroup" aria-label="Cards" className="grid gap-2 px-6 pb-4">
            {CARDS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={card === c.id}
                onClick={() => setCard(c.id)}
                className="flex items-center justify-between rounded-control border border-hairline px-3.5 py-3 text-left outline-none transition-[background-color] duration-150 ease-out hover:bg-wash-hover focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring aria-checked:border-line-brand aria-checked:bg-sky-wash"
              >
                <span className="font-display text-body-sm font-medium text-fg">{c.name}</span>
                <span className="text-body-sm text-fg-muted">{c.limit}</span>
              </button>
            ))}
          </div>
          <DrawerFooter>
            <Button onClick={() => setOpen(false)}>Use {chosen.name}</Button>
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <p className="text-body-sm text-fg-muted">Paying with {chosen.name}</p>
    </div>
  );
}

export function Site() {
  return <ChooseCard />;
}

export function Directions() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <ChooseCard direction="right" />
      <ChooseCard direction="left" />
    </div>
  );
}

export function Open() {
  return (
    <div className="h-120">
      <ChooseCard defaultOpen />
    </div>
  );
}

```

## Source

components/ui/drawer.tsx

```tsx
"use client";

import * as React from "react";
import * as DrawerPrimitive from "@radix-ui/react-dialog";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A panel pulled from an edge of the screen, drawn as the brand's sheet (sheet.tsx: the brand's window, white with a
// 16 percent ink hairline and the code window's drop) over the ink scrim blurred 4px, with 12px corners on its inner
// edge, a 40 by 4px handle in a 35 percent ink line, the title in the 24px display face at 500 and the description in
// 14px at 68 percent ink. It slides in from its edge as it fades (260ms ease-out) and can be dragged away: a flick
// (faster than 0.11px per ms) or a pull past a third of its size closes it, a shorter pull springs back (500ms
// ease-out), and pulling the other way meets growing resistance instead of a wall. The drag follows the pointer even
// off the panel (pointer capture) and ignores a second finger. Reduced motion keeps only the fade.
type Direction = "bottom" | "top" | "left" | "right";

const DrawerContext = React.createContext<{ direction: Direction; setOpen: (open: boolean) => void }>({ direction: "bottom", setOpen: () => {} });

function Drawer({ open: openProp, defaultOpen = false, onOpenChange, direction = "bottom", ...props }: React.ComponentProps<typeof DrawerPrimitive.Root> & { direction?: Direction }) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  return (
    <DrawerContext.Provider value={{ direction, setOpen }}>
      <DrawerPrimitive.Root data-slot="drawer" open={open} onOpenChange={setOpen} {...props} />
    </DrawerContext.Provider>
  );
}

function DrawerTrigger(props: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  const container = usePortalContainer();
  return <DrawerPrimitive.Portal data-slot="drawer-portal" container={container} {...props} />;
}

function DrawerClose(props: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-scrim backdrop-blur-xs transition-opacity duration-260 ease-out starting:opacity-0", className)}
      {...props}
    />
  );
}

const PLACE: Record<Direction, string> = {
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-card border-b-0 starting:translate-y-full",
  top: "inset-x-0 top-0 max-h-[85dvh] flex-col-reverse rounded-b-card border-t-0 starting:-translate-y-full",
  right: "inset-y-0 right-0 w-3/4 flex-row-reverse rounded-l-card border-r-0 sm:max-w-96 starting:translate-x-full",
  left: "inset-y-0 left-0 w-3/4 flex-row rounded-r-card border-l-0 sm:max-w-96 starting:-translate-x-full",
};

// Where a pull closes the drawer: toward its own edge (positive for bottom and right).
const AXIS: Record<Direction, { axis: "x" | "y"; sign: 1 | -1 }> = { bottom: { axis: "y", sign: 1 }, top: { axis: "y", sign: -1 }, right: { axis: "x", sign: 1 }, left: { axis: "x", sign: -1 } };
const VELOCITY = 0.11;
const SKIP = "button, a, input, textarea, select, [role=slider], [contenteditable=true], [data-drawer-no-drag]";

function useDrag(direction: Direction, close: () => void) {
  const panel = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ id: number; start: number; at: number; time: number } | null>(null);
  const { axis, sign } = AXIS[direction];
  const translate = (px: number) => (axis === "y" ? `translateY(${px}px)` : `translateX(${px}px)`);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current || event.button !== 0) return; // one pointer only
    if ((event.target as Element).closest(SKIP)) return;
    if (window.getSelection()?.toString()) return;
    const start = axis === "y" ? event.clientY : event.clientX;
    drag.current = { id: event.pointerId, start, at: 0, time: performance.now() };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (panel.current) panel.current.style.transition = "none";
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId || !panel.current) return;
    const raw = (axis === "y" ? event.clientY : event.clientX) - d.start;
    const toward = raw * sign;
    // Toward the edge it follows the pointer; away from it, resistance grows with distance.
    const moved = toward >= 0 ? toward : -Math.sqrt(-toward) * 2;
    d.at = moved;
    panel.current.style.transform = translate(moved * sign);
  };

  const end = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId || !panel.current) return;
    drag.current = null;
    const el = panel.current;
    const size = axis === "y" ? el.offsetHeight : el.offsetWidth;
    const velocity = Math.abs(d.at) / Math.max(1, performance.now() - d.time);
    if (d.at > 0 && (d.at > size / 3 || velocity > VELOCITY)) {
      el.style.transition = "";
      close();
      return;
    }
    el.style.transition = "transform 500ms var(--ds-easing-out)";
    el.style.transform = "";
    const reset = () => {
      el.style.transition = "";
      el.removeEventListener("transitionend", reset);
    };
    el.addEventListener("transitionend", reset);
  };

  return { panel, handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end } };
}

function DrawerContent({ className, children, ...props }: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  const { direction, setOpen } = React.useContext(DrawerContext);
  const { panel, handlers } = useDrag(direction, () => setOpen(false));
  const vertical = direction === "bottom" || direction === "top";
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={panel}
        data-slot="drawer-content"
        data-direction={direction}
        className={cn("group/drawer fixed z-50 flex touch-none border border-hairline bg-surface text-fg shadow-code outline-none transition-[opacity,translate] duration-260 ease-out starting:opacity-0 motion-reduce:starting:translate-x-0 motion-reduce:starting:translate-y-0", vertical ? "flex-col" : "", PLACE[direction], className)}
        {...handlers}
        {...props}
      >
        <div aria-hidden data-slot="drawer-handle" className={cn("shrink-0 rounded-pill bg-line-strong", vertical ? "mx-auto my-3 h-1 w-10" : "my-auto mx-3 h-10 w-1")} />
        <div className="flex min-h-0 min-w-0 flex-1 touch-auto flex-col overflow-auto">{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-2 px-6 pt-2 pb-4 group-data-[direction=bottom]/drawer:text-center group-data-[direction=top]/drawer:text-center md:text-left md:group-data-[direction=bottom]/drawer:text-left", className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-3 border-t border-line px-6 py-4", className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return <DrawerPrimitive.Title data-slot="drawer-title" className={cn("font-display text-h3 leading-display font-medium tracking-tight text-fg", className)} {...props} />;
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return <DrawerPrimitive.Description data-slot="drawer-description" className={cn("text-body-sm leading-relaxed text-fg-muted", className)} {...props} />;
}

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger };

```
