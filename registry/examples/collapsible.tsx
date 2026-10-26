"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ITEMS = [
  { name: "Two adult fares, Boston to New York", price: "$72.00" },
  { name: "Seat reservation", price: "$8.00" },
  { name: "Booking fee", price: "$6.40" },
];

export function Site() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mx-auto w-full max-w-110 rounded-card border border-hairline bg-surface shadow-guide">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div>
          <p className="font-display text-body-sm font-medium text-fg">Amtrak, $86.40</p>
          <p className="text-caption text-fg-muted">Travel agent, Oct 21</p>
        </div>
        <CollapsibleTrigger className="group inline-flex items-center gap-1 rounded-sm px-2 py-1.5 font-display text-caption text-fg-brand outline-none transition-[background-color] duration-150 ease-out hover:bg-wash-selected focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring">
          {open ? "Hide items" : "Show items"}
          <ChevronDown aria-hidden strokeWidth={1.75} className="size-3.5 transition-[rotate] duration-200 ease-in-out group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ul className="grid gap-2 border-t border-line px-4 py-3.5">
          {ITEMS.map((i) => (
            <li key={i.name} className="flex justify-between gap-4 text-body-sm">
              <span className="text-fg-secondary">{i.name}</span>
              <span className="text-fg tabular-nums">{i.price}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Open() {
  return (
    <Collapsible defaultOpen className="mx-auto grid w-full max-w-110 gap-2">
      <CollapsibleTrigger className="group flex items-center justify-between rounded-control px-3.5 py-3 text-left font-display text-body-sm font-medium text-fg outline-none transition-[background-color] duration-150 ease-out hover:bg-wash-hover focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring">
        Advanced card settings
        <ChevronDown aria-hidden strokeWidth={1.75} className="size-3.5 text-fg-muted transition-[rotate] duration-200 ease-in-out group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="px-3.5 text-body-sm leading-relaxed text-fg-muted">Merchant categories, currency and the hour of day this card can be used. Every change applies to the next checkout.</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
