"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
      <DropdownMenuContent align="start" onOpenAutoFocus={defaultOpen ? (event) => event.preventDefault() : undefined} onCloseAutoFocus={defaultOpen ? (event) => event.preventDefault() : undefined}>
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
        <DropdownMenuContent variant="glass" align="start" className="w-64" onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()}>
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

// A working glass submenu and a persistent preference; the submenu inherits its parent panel's treatment.
export function Choices() {
  const [notifications, setNotifications] = React.useState(true);
  return (
    <Surface ground="blue" className="min-h-80 rounded-panel p-8">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild><Button variant="on-brand">Preferences</Button></DropdownMenuTrigger>
        <DropdownMenuContent variant="glass" align="start">
          <DropdownMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>Notifications</DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Exports</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>CSV</DropdownMenuItem>
              <DropdownMenuItem>JSON</DropdownMenuItem>
              <DropdownMenuItem disabled>PDF (coming soon)</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="mt-56 font-display text-caption" role="status">Notifications {notifications ? "on" : "off"}</p>
    </Surface>
  );
}
