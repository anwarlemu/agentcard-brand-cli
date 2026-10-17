"use client";

import { useState } from "react";
import { HoldButton } from "@/components/ui/hold-button";
import { Button } from "@/components/ui/button";

export function Site() {
  const [closed, setClosed] = useState(false);
  return <div className="grid justify-items-start gap-3">
    <HoldButton label="Hold to close card" disabled={closed} onConfirm={() => setClosed(true)} />
    <p role="status" className="text-body-sm text-fg-muted">{closed ? "Card closed. It can no longer make purchases." : "Card active. Release early to cancel."}</p>
    {closed && <Button variant="secondary" size="sm" onClick={() => setClosed(false)}>Reset demo</Button>}
  </div>;
}
