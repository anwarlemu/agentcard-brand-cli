# Carousel
Slides that snap into place with white keys to move between them.

Install: npx agentcard-ds add carousel
Requires: theme, utils
Packages: lucide-react
Exports: Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel, CarouselApi
Client boundary: yes
Reference: Extrapolated from Agentcard (button.tsx white key, marquee rows)


## Usage
Use to browse a few items of the same kind (card designs, merchant logos, receipts). Wrap CarouselItem in CarouselContent and add CarouselPrevious and CarouselNext; use setApi to show the position.
- Avoid: Autoplay
- Avoid: Essential content only on later slides
- Avoid: More than one carousel in view


## Examples
Example components: npx agentcard-ds add carousel window
[Site](https://agentcard-ds.vercel.app/preview/carousel/Site) | [Sizes](https://agentcard-ds.vercel.app/preview/carousel/Sizes) | [Vertical](https://agentcard-ds.vercel.app/preview/carousel/Vertical)

examples/carousel.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Window } from "@/components/ui/window";

const CARDS = [
  { name: "travel.card", agent: "Travel agent", limit: "$250 per purchase", last: "4242" },
  { name: "groceries.card", agent: "Groceries agent", limit: "$120 per purchase", last: "1881" },
  { name: "software.card", agent: "Software agent", limit: "$60 per purchase", last: "3007" },
  { name: "events.card", agent: "Events agent", limit: "$400 per purchase", last: "5510" },
  { name: "office.card", agent: "Office agent", limit: "$90 per purchase", last: "7731" },
];

function Card({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <Window name={card.name} className="h-full shadow-guide" bodyClassName="grid gap-6 p-5">
      <p className="font-display text-h4 leading-display font-medium tracking-tight text-fg">{card.agent}</p>
      <div className="flex items-end justify-between gap-3 text-body-sm">
        <span className="text-fg-muted">{card.limit}</span>
        <span className="font-display tabular-nums text-fg-brand">•••• {card.last}</span>
      </div>
    </Window>
  );
}

export function Site() {
  const [api, setApi] = useState<CarouselApi>();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (!api) return;
    const update = () => setAt(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => api.off("select", update);
  }, [api]);
  return (
    <div className="mx-auto grid w-full max-w-sm gap-3 px-12">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {CARDS.map((c) => (
            <CarouselItem key={c.name}>
              <Card card={c} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="text-center font-display text-caption text-fg-muted tabular-nums">
        Card {at + 1} of {CARDS.length}
      </p>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="mx-auto w-full max-w-2xl px-12">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {CARDS.map((c) => (
            <CarouselItem key={c.name} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <Card card={c} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="mx-auto w-full max-w-xs py-12">
      <Carousel orientation="vertical" opts={{ align: "start" }}>
        <CarouselContent className="h-60">
          {CARDS.map((c) => (
            <CarouselItem key={c.name} className="basis-1/2">
              <Card card={c} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

```

## Source

components/ui/carousel.tsx

```tsx
"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// A row of slides that snap into place, as the brand's marquee rows and card grids show many of a kind. Slides scroll
// natively (touch, trackpad and wheel) and snap; the previous and next controls are the brand's 32px white keys (a
// hairline, 8px corners, the key's light top and soft drop, a press that sinks a pixel) with an ink arrow, outside the
// row. Arrow keys move a slide when the carousel has focus. The scroll is smooth (the browser's own easing) unless
// reduced motion is set.

type CarouselEvent = "select" | "reInit";
type CarouselApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: CarouselEvent, callback: (api: CarouselApi) => void) => void;
  off: (event: CarouselEvent, callback: (api: CarouselApi) => void) => void;
};
type CarouselOptions = { loop?: boolean; align?: "start" | "center" | "end" };

type CarouselProps = {
  opts?: CarouselOptions;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  viewport: React.RefObject<HTMLDivElement | null>;
  orientation: "horizontal" | "vertical";
  align: "start" | "center" | "end";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  update: () => void;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}

function Carousel({ orientation = "horizontal", opts, setApi, className, children, ...props }: React.ComponentProps<"div"> & CarouselProps) {
  const viewport = React.useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = React.useState({ prev: false, next: false, index: 0 });
  const listeners = React.useRef<Record<CarouselEvent, Set<(api: CarouselApi) => void>>>({ select: new Set(), reInit: new Set() });
  const vertical = orientation === "vertical";
  const loop = !!opts?.loop;

  const slides = React.useCallback(() => Array.from(viewport.current?.querySelectorAll<HTMLElement>(":scope > [data-slot=carousel-content] > [data-slot=carousel-item]") ?? []), []);
  const offsetOf = React.useCallback((el: HTMLElement) => (vertical ? el.offsetTop : el.offsetLeft), [vertical]);
  const current = React.useCallback(() => {
    const el = viewport.current;
    if (!el) return 0;
    const pos = vertical ? el.scrollTop : el.scrollLeft;
    const list = slides();
    let best = 0;
    list.forEach((s, i) => {
      if (Math.abs(offsetOf(s) - pos) < Math.abs(offsetOf(list[best]) - pos)) best = i;
    });
    return best;
  }, [offsetOf, slides, vertical]);

  const scrollTo = React.useCallback((index: number) => {
    const el = viewport.current;
    const list = slides();
    if (!el || !list.length) return;
    const i = loop ? (index + list.length) % list.length : Math.max(0, Math.min(list.length - 1, index));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ [vertical ? "top" : "left"]: offsetOf(list[i]), behavior: reduce ? "auto" : "smooth" });
  }, [loop, offsetOf, slides, vertical]);

  const api = React.useMemo<CarouselApi>(() => {
    const self: CarouselApi = {
      scrollPrev: () => scrollTo(current() - 1),
      scrollNext: () => scrollTo(current() + 1),
      scrollTo,
      canScrollPrev: () => {
        const el = viewport.current;
        return !!el && (loop || (vertical ? el.scrollTop : el.scrollLeft) > 1);
      },
      canScrollNext: () => {
        const el = viewport.current;
        if (!el) return false;
        return loop || (vertical ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
      },
      selectedScrollSnap: current,
      scrollSnapList: () => slides().map((_, i) => i),
      on: (event, cb) => void listeners.current[event].add(cb),
      off: (event, cb) => void listeners.current[event].delete(cb),
    };
    return self;
  }, [current, loop, scrollTo, slides, vertical]);

  // The last announced slide, so select listeners run once per change and outside React's render.
  const lastIndex = React.useRef(0);
  const update = React.useCallback(() => {
    const next = { prev: api.canScrollPrev(), next: api.canScrollNext(), index: api.selectedScrollSnap() };
    setEdges((e) => (e.prev === next.prev && e.next === next.next && e.index === next.index ? e : next));
    if (lastIndex.current !== next.index) {
      lastIndex.current = next.index;
      listeners.current.select.forEach((cb) => cb(api));
    }
  }, [api]);

  React.useEffect(() => {
    setApi?.(api);
    const el = viewport.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(() => {
      update();
      listeners.current.reInit.forEach((cb) => cb(api));
    });
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [api, setApi, update]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const back = vertical ? "ArrowUp" : "ArrowLeft";
    const forward = vertical ? "ArrowDown" : "ArrowRight";
    if (event.key === back) {
      event.preventDefault();
      api.scrollPrev();
    } else if (event.key === forward) {
      event.preventDefault();
      api.scrollNext();
    }
  };

  return (
    <CarouselContext.Provider value={{ viewport, orientation, align: opts?.align ?? "start", scrollPrev: api.scrollPrev, scrollNext: api.scrollNext, canScrollPrev: edges.prev, canScrollNext: edges.next, update }}>
      <div onKeyDownCapture={onKeyDown} className={cn("relative min-w-0", className)} role="region" aria-roledescription="carousel" data-slot="carousel" data-orientation={orientation} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { viewport, orientation } = useCarousel();
  const vertical = orientation === "vertical";
  return (
    <div
      ref={viewport}
      data-slot="carousel-viewport"
      className={cn("overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", vertical ? "h-full snap-y snap-mandatory" : "snap-x snap-mandatory")}
    >
      <div data-slot="carousel-content" className={cn("flex", vertical ? "-mt-4 flex-col" : "-ml-4", className)} {...props} />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, align } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", align === "center" ? "snap-center" : align === "end" ? "snap-end" : "snap-start", className)}
      {...props}
    />
  );
}

const ARROW =
  "absolute inline-flex size-8 items-center justify-center rounded-control border border-hairline bg-surface text-fg shadow-key outline-none transition-[background-color,box-shadow,opacity] duration-150 ease-out hover:bg-sky-wash active:shadow-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none [&_svg]:size-4";

function CarouselPrevious({ className, ...props }: React.ComponentProps<"button">) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type="button"
      data-slot="carousel-previous"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(ARROW, orientation === "horizontal" ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      {...props}
    >
      <ArrowLeft strokeWidth={1.75} />
      <span className="sr-only">Previous slide</span>
    </button>
  );
}

function CarouselNext({ className, ...props }: React.ComponentProps<"button">) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type="button"
      data-slot="carousel-next"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(ARROW, orientation === "horizontal" ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      {...props}
    >
      <ArrowRight strokeWidth={1.75} />
      <span className="sr-only">Next slide</span>
    </button>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel };
export type { CarouselApi };

```
