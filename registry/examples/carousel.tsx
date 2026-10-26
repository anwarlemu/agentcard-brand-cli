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
