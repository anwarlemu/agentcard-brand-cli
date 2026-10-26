"use client";

import { useState } from "react";
import { Copy, Download, Flag, Receipt, Trash2 } from "lucide-react";

import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";

function Purchase() {
  return (
    <div className="grid gap-1 rounded-control border border-hairline bg-surface p-4 select-none">
      <p className="font-display text-body-sm font-medium text-fg">Amtrak, $86.40</p>
      <p className="text-caption text-fg-muted">Travel agent, Oct 21. Right-click for actions.</p>
    </div>
  );
}

export function Site() {
  const [receipts, setReceipts] = useState(true);
  const [card, setCard] = useState("travel");
  const [last, setLast] = useState("");
  return (
    <div className="mx-auto grid w-full max-w-96 gap-3">
      <ContextMenu>
        <ContextMenuTrigger>
          <Purchase />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-60">
          <ContextMenuLabel>Purchase</ContextMenuLabel>
          <ContextMenuItem onSelect={() => setLast("Receipt opened")}>
            <Receipt strokeWidth={1.5} />
            Open receipt
            <ContextMenuShortcut>⏎</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setLast("Order number copied")}>
            <Copy strokeWidth={1.5} />
            Copy order number
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Download strokeWidth={1.5} />
              Export as
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => setLast("Exported as PDF")}>PDF</ContextMenuItem>
              <ContextMenuItem onSelect={() => setLast("Exported as CSV")}>CSV</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={receipts} onCheckedChange={(on) => setReceipts(on === true)}>
            Email receipts
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Charge to</ContextMenuLabel>
          <ContextMenuRadioGroup value={card} onValueChange={setCard}>
            <ContextMenuRadioItem value="travel">Travel card</ContextMenuRadioItem>
            <ContextMenuRadioItem value="team">Team card</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuItem disabled>
            <Flag strokeWidth={1.5} />
            Dispute (after it settles)
          </ContextMenuItem>
          <ContextMenuItem variant="destructive" onSelect={() => setLast("Purchase hidden")}>
            <Trash2 strokeWidth={1.5} />
            Hide purchase
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p role="status" className="text-body-sm text-fg-muted empty:hidden">
        {last}
      </p>
    </div>
  );
}
