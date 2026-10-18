"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MERCHANTS = [
  { id: "airlines", label: "Airlines", checked: true },
  { id: "hotels", label: "Hotels", checked: true },
  { id: "software", label: "Software subscriptions", checked: false },
];

export function Site() {
  const [selected, setSelected] = useState(MERCHANTS.filter((merchant) => merchant.checked).map((merchant) => merchant.id));
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 font-display text-caption text-fg-muted">What this card can buy</legend>
      {MERCHANTS.map((merchant) => (
        <Label variant="control" key={merchant.id} htmlFor={`checkbox-${merchant.id}`}>
          <Checkbox id={`checkbox-${merchant.id}`} checked={selected.includes(merchant.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, merchant.id] : current.filter((id) => id !== merchant.id))} />
          {merchant.label}
        </Label>
      ))}
      <Label variant="control" htmlFor="checkbox-all" className="mt-2">
        <Checkbox id="checkbox-all" checked={selected.length === MERCHANTS.length ? true : selected.length ? "indeterminate" : false} onCheckedChange={(checked) => setSelected(checked ? MERCHANTS.map((merchant) => merchant.id) : [])} />
        All categories
      </Label>
      <Label variant="control" htmlFor="checkbox-disabled">
        <Checkbox id="checkbox-disabled" disabled />
        Cash withdrawals (never allowed)
      </Label>
    </fieldset>
  );
}
