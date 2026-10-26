"use client";

import * as React from "react";
import { CircleAlert, Info, Megaphone } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function Site() {
  return (
    <Alert name="voice.beta" className="max-w-3xl">
      <Info />
      <AlertTitle>Voice is in beta</AlertTitle>
      <AlertDescription>Your agent can now place orders over the phone. Calls use the same card and limits as online purchases.</AlertDescription>
      <AlertAction>
        <Button size="sm" asChild>
          <a href="https://www.agentcard.sh" target="_blank" rel="noreferrer">
            Try Voice
          </a>
        </Button>
      </AlertAction>
    </Alert>
  );
}

export function Brand() {
  return (
    <Alert variant="brand" name="issuing.news" className="max-w-3xl">
      <Megaphone />
      <AlertTitle>Commercial cards are here</AlertTitle>
      <AlertDescription>Issue a card per agent, each with its own limit and list of merchants.</AlertDescription>
    </Alert>
  );
}

export function Destructive() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid max-w-3xl gap-3">
      <Alert variant="destructive" name="agent.paused">
        <CircleAlert />
        <AlertTitle>Travel agent was paused</AlertTitle>
        <AlertDescription>It reached its $2,000 monthly limit on Oct 14.</AlertDescription>
        <AlertAction>
          <Button variant="secondary" size="sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Hide details" : "Review"}
          </Button>
        </AlertAction>
      </Alert>
      {open && <p className="text-body-sm text-fg-muted">Purchases are paused until the limit resets on Nov 1, or until you raise it.</p>}
    </div>
  );
}

export function WithoutBar() {
  return (
    <Alert name={null} className="max-w-xl">
      <AlertTitle>Cards are single-use by default</AlertTitle>
      <AlertDescription>Each card closes after its first purchase. Turn on multi-use in the card settings.</AlertDescription>
    </Alert>
  );
}
