"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function Site() {
  const [limit, setLimit] = React.useState([250]);
  return (
    <div className="grid w-full max-w-100 gap-3">
      <div className="flex items-baseline justify-between">
        <Label id="limit-label">Daily spending limit</Label>
        <span className="font-display text-body-sm text-fg tabular-nums">${limit[0]}</span>
      </div>
      <Slider aria-labelledby="limit-label" value={limit} onValueChange={setLimit} max={1000} step={25} />
    </div>
  );
}

export function Range() {
  const [range, setRange] = React.useState([20, 400]);
  return (
    <div className="grid w-full max-w-100 gap-3">
      <div className="flex items-baseline justify-between">
        <Label id="range-label">Allowed purchase size</Label>
        <span className="font-display text-body-sm text-fg tabular-nums">
          ${range[0]} to ${range[1]}
        </span>
      </div>
      <Slider aria-labelledby="range-label" value={range} onValueChange={setRange} max={1000} step={10} minStepsBetweenThumbs={1} />
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-100 gap-6">
      <Slider aria-label="Disabled limit" defaultValue={[60]} disabled />
      <div className="flex h-40 gap-8">
        <Slider aria-label="Vertical limit" defaultValue={[40]} orientation="vertical" />
      </div>
    </div>
  );
}
