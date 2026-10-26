"use client";

import * as React from "react";
import { LayoutGrid, List, Rows3 } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Site() {
  const [merchants, setMerchants] = React.useState(["airlines", "hotels"]);
  return (
    <div className="grid gap-3">
      <p id="merchant-label" className="font-display text-caption text-fg-muted">
        This card can buy from
      </p>
      <ToggleGroup type="multiple" aria-labelledby="merchant-label" value={merchants} onValueChange={setMerchants}>
        <ToggleGroupItem value="airlines">Airlines</ToggleGroupItem>
        <ToggleGroupItem value="hotels">Hotels</ToggleGroupItem>
        <ToggleGroupItem value="software">Software</ToggleGroupItem>
        <ToggleGroupItem value="groceries">Groceries</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function Outline() {
  return (
    <div className="grid gap-4">
      <ToggleGroup type="single" variant="outline" defaultValue="grid" aria-label="View">
        <ToggleGroupItem value="grid" aria-label="Grid">
          <LayoutGrid />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List">
          <List />
        </ToggleGroupItem>
        <ToggleGroupItem value="rows" aria-label="Rows">
          <Rows3 />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" spacing={0} defaultValue="week" aria-label="Period">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="grid gap-4">
      <ToggleGroup type="single" size="sm" defaultValue="all" aria-label="Status">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="approved">Approved</ToggleGroupItem>
        <ToggleGroupItem value="declined">Declined</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="monthly" aria-label="Billing">
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
        <ToggleGroupItem value="custom" disabled>
          Custom
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
