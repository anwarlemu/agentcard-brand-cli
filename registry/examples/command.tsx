import { CreditCard, FileText, Settings, Wallet } from "lucide-react";

import { Command, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

export function Site() {
  return (
    <Command className="w-full max-w-xl rounded-card border border-hairline shadow-code">
      <CommandInput placeholder="Search cards, guides and settings" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        <CommandGroup heading="Go to">
          <CommandItem>
            <CreditCard strokeWidth={1.5} /> Cards
            <CommandShortcut>
              <Kbd>G</Kbd> then <Kbd>C</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Wallet strokeWidth={1.5} /> Vault
            <CommandShortcut>
              <Kbd>G</Kbd> then <Kbd>V</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings strokeWidth={1.5} /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Guides">
          <CommandItem>
            <FileText strokeWidth={1.5} /> Give an agent its first card
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
        </span>
        <span>
          <Kbd>↵</Kbd> to open
        </span>
        <span className="ml-auto">
          <Kbd>esc</Kbd> to close
        </span>
      </CommandFooter>
    </Command>
  );
}
