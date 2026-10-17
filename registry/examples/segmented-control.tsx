"use client";

import * as React from "react";

import { SegmentedControl } from "@/components/ui/segmented-control";

export function Site() {
  const [period, setPeriod] = React.useState<"month" | "year">("month");
  const [kind, setKind] = React.useState<"prepaid" | "commercial" | "virtual">("prepaid");
  return (
    <div className="grid gap-6">
      <SegmentedControl
        label="Billing"
        value={period}
        onValueChange={setPeriod}
        options={[
          { value: "month", label: "Monthly" },
          { value: "year", label: "Yearly" },
        ]}
      />
      <SegmentedControl
        label="Card type"
        size="sm"
        value={kind}
        onValueChange={setKind}
        options={[
          { value: "prepaid", label: "Prepaid", count: 4 },
          { value: "commercial", label: "Commercial", count: 2 },
          { value: "virtual", label: "Single use", count: 9 },
        ]}
      />
    </div>
  );
}

export function Plain() {
  const [range, setRange] = React.useState<"day" | "week" | "month">("week");
  return (
    <SegmentedControl
      label="Range"
      variant="plain"
      value={range}
      onValueChange={setRange}
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  );
}
