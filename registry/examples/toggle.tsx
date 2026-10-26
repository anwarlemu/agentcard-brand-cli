"use client";

import { Bold, Italic, Pin, Receipt } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export function Site() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Pin this card" defaultPressed>
        <Pin />
      </Toggle>
      <Toggle>
        <Receipt />
        Show receipts
      </Toggle>
    </div>
  );
}

export function Variants() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" aria-label="Bold">
          <Bold />
        </Toggle>
        <Toggle variant="outline" aria-label="Italic" defaultPressed>
          <Italic />
        </Toggle>
        <Toggle variant="outline">Declined only</Toggle>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle size="sm">Small</Toggle>
        <Toggle size="lg">Large</Toggle>
        <Toggle disabled>Disabled</Toggle>
      </div>
    </div>
  );
}
