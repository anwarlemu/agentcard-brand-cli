"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PERIODS = [
  { value: "purchase", label: "Per purchase" },
  { value: "day", label: "Per day" },
  { value: "month", label: "Per month" },
];

export function Site() {
  const [period, setPeriod] = React.useState("day");
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 font-display text-caption text-fg-muted">Spending limit applies</legend>
      <RadioGroup name="period" value={period} onValueChange={setPeriod}>
        {PERIODS.map((p) => (
          <Label variant="control" key={p.value} htmlFor={`period-${p.value}`}>
            <RadioGroupItem value={p.value} id={`period-${p.value}`} />
            {p.label}
          </Label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export function States() {
  return (
    <RadioGroup defaultValue="virtual" className="grid gap-3">
      <Label variant="control" htmlFor="card-virtual">
        <RadioGroupItem value="virtual" id="card-virtual" />
        Virtual card
      </Label>
      <Label variant="control" htmlFor="card-physical">
        <RadioGroupItem value="physical" id="card-physical" disabled />
        Physical card (coming soon)
      </Label>
      <Label variant="control" htmlFor="card-invalid">
        <RadioGroupItem value="none" id="card-invalid" aria-invalid />
        No card (choose one)
      </Label>
    </RadioGroup>
  );
}

export function Horizontal() {
  return (
    <RadioGroup defaultValue="usd" aria-label="Currency" className="flex flex-wrap gap-6">
      {["usd", "eur", "gbp"].map((c) => (
        <Label variant="control" key={c} htmlFor={`cur-${c}`}>
          <RadioGroupItem value={c} id={`cur-${c}`} />
          {c.toUpperCase()}
        </Label>
      ))}
    </RadioGroup>
  );
}
