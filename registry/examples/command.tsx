"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const GUIDES: Record<string, string> = {
  "Enable payments for your agent": "Create a card, set a purchase limit, and give the card token to your agent.",
  "Differences between Vault and Issuing": "Vault stores an existing card. Issuing creates a separate card for each agent.",
  "How we store cards": "Your agent uses a token to request a payment without receiving the stored card details.",
  "Get your Agentcard credentials": "Create credentials in your Agentcard account and keep the secret on your server.",
  "Deploy to Vercel": "Add your credentials as server environment variables before deploying your agent.",
};
function Guide({ title }: { title: string }) {
  return title ? <section aria-label="Selected guide" className="mt-4 grid gap-2 text-body-sm"><h3 className="font-display">{title}</h3><p className="text-fg-muted">{GUIDES[title]}</p></section> : null;
}

function Results({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <>
      <CommandInput placeholder="Search the guides" aria-label="Search the guides" hint="Esc" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Start here">
          <CommandItem description="Getting started" onSelect={() => onSelect("Enable payments for your agent")}>Enable payments for your agent</CommandItem>
          <CommandItem description="Getting started" onSelect={() => onSelect("Differences between Vault and Issuing")}>Differences between Vault and Issuing</CommandItem>
          <CommandItem description="Agentic purchases explained" onSelect={() => onSelect("How we store cards")}>How we store cards</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Set up">
          <CommandItem description="Create an iMessage agent and connect the Vault" onSelect={() => onSelect("Get your Agentcard credentials")}>Get your Agentcard credentials</CommandItem>
          <CommandItem description="Create an iMessage agent and connect the Vault" onSelect={() => onSelect("Deploy to Vercel")}>Deploy to Vercel</CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> to move
        </span>
        <span>
          <kbd>↵</kbd> to open
        </span>
        <span>
          <kbd>Esc</kbd> to close
        </span>
      </CommandFooter>
    </>
  );
}

export function Site() {
  const [guide, setGuide] = React.useState("");
  return (
    <div className="grid max-w-160 gap-4"><Command name="search.guides" className="max-w-160">
      <Results onSelect={setGuide} />
    </Command>
    <Guide title={guide} />
    </div>
  );
}

function Palette({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [guide, setGuide] = React.useState("");
  const [open, setOpen] = React.useState(defaultOpen);
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((now) => !now);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Search the guides
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} name="search.guides" title="Search the guides" description="Search every section of every guide">
        <Results onSelect={(value) => { setGuide(value); setOpen(false); }} />
      </CommandDialog>
      <Guide title={guide} />
    </>
  );
}

export function Open() {
  return (
    <div className="h-170">
      <Palette defaultOpen />
    </div>
  );
}
