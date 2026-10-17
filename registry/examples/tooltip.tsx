"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pause, Plus, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ACTIONS = [
  { label: "New card", icon: Plus },
  { label: "Pause card", icon: Pause },
  { label: "Card settings", icon: Settings },
];

export function Site() {
  const [nickname, setNickname] = useState("Travel agent");
  const [cards, setCards] = useState(1);
  const [paused, setPaused] = useState(false);
  const [settings, setSettings] = useState(false);
  return (
    <TooltipProvider>
    <div className="flex gap-2 pt-10">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" aria-label={label === "Pause card" && paused ? "Resume card" : label} onClick={() => { if (label === "New card") setCards(cards + 1); else if (label === "Pause card") setPaused(!paused); else setSettings(!settings); }}>
              <Icon strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label === "Pause card" && paused ? "Resume card" : label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
    <p role="status" className="mt-3 text-body-sm text-fg-muted">{cards} {cards === 1 ? "card" : "cards"}. {nickname || "Unnamed card"} {paused ? "paused" : "active"}.</p>
    {settings && <Field label="Card nickname"><Input value={nickname} onChange={(event) => setNickname(event.target.value)} /></Field>}
    </TooltipProvider>
  );
}

export function Open() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="flex gap-2 pt-10">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" aria-label={paused ? "Resume card" : "Pause card"} onClick={() => setPaused(!paused)}>
            <Pause strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{paused ? "Resume card" : "Pause card"}</TooltipContent>
      </Tooltip>
      <p role="status" className="text-body-sm text-fg-muted">{paused ? "Card paused." : "Card active."}</p>
    </div>
  );
}
