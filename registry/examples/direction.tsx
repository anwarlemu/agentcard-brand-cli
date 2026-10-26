"use client";

import * as React from "react";

import { DirectionProvider } from "@/components/ui/direction";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";

export function Site() {
  const [period, setPeriod] = React.useState("day");
  return (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="grid w-full max-w-100 gap-4">
        <p className="font-display text-caption text-fg-muted">حد الإنفاق اليومي</p>
        <Slider aria-label="Daily limit" defaultValue={[40]} />
        <SegmentedControl label="Period" value={period} onValueChange={setPeriod} options={[{ value: "day", label: "يوم" }, { value: "week", label: "أسبوع" }, { value: "month", label: "شهر" }]} />
      </div>
    </DirectionProvider>
  );
}
