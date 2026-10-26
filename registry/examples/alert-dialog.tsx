"use client";

import { useState } from "react";
import { Snowflake } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function RemoveAgent({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [status, setStatus] = useState("");
  return (
    <div className="grid justify-items-center gap-3">
      <AlertDialog defaultOpen={defaultOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Remove agent</Button>
        </AlertDialogTrigger>
        <AlertDialogContent name="agent.remove">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Travel agent?</AlertDialogTitle>
            <AlertDialogDescription>Its three cards close at once and any purchase in progress is declined. Past receipts stay in your history.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep agent</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => setStatus("Travel agent removed.")}>
              Remove agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p role="status" className="text-body-sm text-fg-muted empty:hidden">
        {status}
      </p>
    </div>
  );
}

export function Site() {
  return <RemoveAgent />;
}

export function Small() {
  return (
    <div className="grid justify-items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Freeze card</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm" name="card.freeze">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Snowflake strokeWidth={1.5} />
            </AlertDialogMedia>
            <AlertDialogTitle>Freeze this card?</AlertDialogTitle>
            <AlertDialogDescription>The agent cannot buy with it until you unfreeze it.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Freeze</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function Open() {
  return (
    <div className="h-110">
      <RemoveAgent defaultOpen />
    </div>
  );
}
