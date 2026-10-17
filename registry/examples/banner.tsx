"use client";

import { useState } from "react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";

export function Site() {
  const [reviewing, setReviewing] = useState(false);
  return <div className="grid max-w-3xl gap-4">
    <Banner name="voice.beta" title="Voice is in beta" actions={<Button size="sm" asChild><a href="https://cal.com/team/agentcard/agentcard-call" target="_blank" rel="noreferrer">Try Voice</a></Button>}>Your agent can now place orders over the phone.</Banner>
    <Banner tone="brand" name="issuing.news" title="Commercial cards are here" actions={<Button size="sm" asChild><a href="https://www.agentcard.sh/issuing" target="_blank" rel="noreferrer">See Issuing</a></Button>}>Issue a card per agent with its own limits.</Banner>
    <Banner tone="alert" name="agent.paused" title="Travel agent was paused" actions={<Button variant="secondary" size="sm" aria-expanded={reviewing} onClick={() => setReviewing(!reviewing)}>{reviewing ? "Hide details" : "Review"}</Button>}>It hit its monthly limit on Oct 14.</Banner>
    {reviewing && <p className="text-body-sm text-fg-muted">Travel agent has spent $2,000 of its $2,000 monthly limit. Purchases are paused until its limit resets.</p>}
  </div>;
}
