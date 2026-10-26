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
