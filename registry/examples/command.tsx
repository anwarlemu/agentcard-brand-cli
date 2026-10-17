"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

function Results() {
  return (
    <>
      <CommandInput placeholder="Search the guides" aria-label="Search the guides" hint="Esc" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Start here">
          <CommandItem description="Getting started">Enable payments for your agent</CommandItem>
          <CommandItem description="Getting started">Differences between Vault and Issuing</CommandItem>
          <CommandItem description="Agentic purchases explained">How we store cards</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Set up">
          <CommandItem description="Create an iMessage agent and connect the Vault">Get your Agentcard credentials</CommandItem>
          <CommandItem description="Create an iMessage agent and connect the Vault">Deploy to Vercel</CommandItem>
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
  return (
    <Command name="search.guides" className="max-w-160">
      <Results />
    </Command>
  );
}

function Palette({ defaultOpen = false }: { defaultOpen?: boolean }) {
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
        <Results />
      </CommandDialog>
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
