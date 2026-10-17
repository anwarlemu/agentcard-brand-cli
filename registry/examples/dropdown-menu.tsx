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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { Surface } from "@/lib/surface";

function CardMenu({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [paused, setPaused] = React.useState(false);
  const [closed, setClosed] = React.useState(false);
  const [limit, setLimit] = React.useState(250);
  const [balance, setBalance] = React.useState(500);
  const [editing, setEditing] = React.useState<"limit" | "funds" | null>(null);
  const [message, setMessage] = React.useState("");
  return (
    <div className="grid justify-items-start gap-3">
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" disabled={closed}>Card actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onOpenAutoFocus={defaultOpen ? (event) => event.preventDefault() : undefined} onCloseAutoFocus={defaultOpen ? (event) => event.preventDefault() : undefined}>
        <DropdownMenuLabel>Travel agent</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setEditing("limit")}>
          Edit limits
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setEditing("funds")}>
          Add funds
          <DropdownMenuShortcut>F</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => { setPaused(!paused); setMessage(paused ? "Card resumed." : "Card paused."); }}>{paused ? "Resume card" : "Pause card"}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuHoldItem onConfirm={() => { setClosed(true); setOpen(false); setEditing(null); setMessage("Card closed."); }}>Close card</DropdownMenuHoldItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {editing && <form key={editing} className="grid gap-3" onSubmit={(event) => {
      event.preventDefault();
      const amount = Number(new FormData(event.currentTarget).get("amount"));
      if (editing === "limit") { setLimit(amount); setMessage(`Purchase limit updated to $${amount.toFixed(2)}.`); }
      else { setBalance(balance + amount); setMessage(`Balance updated to $${(balance + amount).toFixed(2)}.`); }
      setEditing(null);
    }}>
      <Field label={editing === "limit" ? "Purchase limit (USD)" : "Amount to add (USD)"} required>
        <Input name="amount" type="number" min="0.01" step="0.01" defaultValue={editing === "limit" ? limit : 100} />
      </Field>
      <div className="flex gap-2"><Button type="submit">{editing === "limit" ? "Save limit" : "Add funds"}</Button><Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancel</Button></div>
    </form>}
    <p role="status" className="text-body-sm text-fg-muted empty:hidden">{message}</p>
    {closed && <Button variant="secondary" size="sm" onClick={() => { setClosed(false); setPaused(false); setMessage("Card active."); }}>Reset demo</Button>}
    </div>
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
  const [product, setProduct] = React.useState("");
  return (
    <Surface ground="blue" className="flex h-80 flex-col items-start gap-4 rounded-panel p-8">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="on-brand">Products</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent variant="glass" align="start" className="w-64" onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()}>
          <DropdownMenuItem onSelect={() => setProduct("Vault")}>Vault</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setProduct("Issuing")}>Issuing</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setProduct("Voice")}>Voice</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setProduct("Updates")}>
            Updates
            <DropdownMenuShortcut>New</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {product && <p role="status" className="text-body-sm">{product === "Vault" ? "Vault stores cards for your agents." : product === "Issuing" ? "Issuing creates a card for each agent." : product === "Voice" ? "Voice lets customers approve purchases by speaking." : "You’re viewing the latest product updates."}</p>}
    </Surface>
  );
}

// A working glass submenu and a persistent preference; the submenu inherits its parent panel's treatment.
export function Choices() {
  const [exported, setExported] = React.useState("");
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
              <DropdownMenuItem onSelect={() => setExported(`notifications\n${notifications}`)}>CSV</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setExported(JSON.stringify({ notifications }, null, 2))}>JSON</DropdownMenuItem>
              <DropdownMenuItem disabled>PDF (coming soon)</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {exported && <div className="mt-4 flex items-start gap-3"><pre aria-label="Export preview" className="text-body-sm">{exported}</pre><CopyButton value={exported} label="Copy export" /></div>}
      <p className="mt-56 font-display text-caption" role="status">Notifications {notifications ? "on" : "off"}</p>
    </Surface>
  );
}
