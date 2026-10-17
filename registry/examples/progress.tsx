"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function Site() {
  const [spent, setSpent] = useState(1240);
  return <div className="grid max-w-md gap-3">
    <div className="flex items-baseline justify-between gap-3 font-display text-body-sm"><span>Spent this month</span><span className="text-fg-muted tabular-nums">${spent.toLocaleString("en-US")} of $2,000</span></div>
    <Progress value={spent} max={2000} aria-label="Spent this month" />
    <div className="flex gap-2"><Button size="sm" disabled={spent >= 2000} onClick={() => setSpent(Math.min(2000, spent + 100))}>Spend $100</Button><Button variant="secondary" size="sm" onClick={() => setSpent(1240)}>Reset</Button></div>
  </div>;
}
