"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHoldItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Surface } from "@/lib/surface";

function CardMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <DropdownMenu defaultOpen={defaultOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Card actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Travel agent</DropdownMenuLabel>
        <DropdownMenuItem>
          Edit limits
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Add funds
          <DropdownMenuShortcut>F</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Pause card</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuHoldItem onConfirm={() => {}}>Close card</DropdownMenuHoldItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Site() {
  return <CardMenu />;
}

export function Open() {
  return (
    <div className="h-64">
      <CardMenu defaultOpen />
    </div>
  );
}

// The dock's menu: glass over whatever is behind it.
export function Glass() {
  return (
    <Surface ground="blue" className="flex h-80 items-start rounded-panel p-8">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="on-brand">Products</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent variant="glass" align="start" className="w-64">
          <DropdownMenuItem>Vault</DropdownMenuItem>
          <DropdownMenuItem>Issuing</DropdownMenuItem>
          <DropdownMenuItem>Voice</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Updates
            <DropdownMenuShortcut>New</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Surface>
  );
}
