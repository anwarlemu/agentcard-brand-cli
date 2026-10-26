"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

type Purchase = { id: string; merchant: string; agent: string; card: string; amount: number; date: string; status: "Settled" | "Pending" | "Declined" };

const PURCHASES: Purchase[] = [
  { id: "p-1042", merchant: "Amtrak", agent: "Travel agent", card: "4242", amount: 86.4, date: "2026-10-21", status: "Settled" },
  { id: "p-1041", merchant: "Whole Foods", agent: "Groceries agent", card: "1881", amount: 112.18, date: "2026-10-21", status: "Pending" },
  { id: "p-1040", merchant: "Figma", agent: "Software agent", card: "3007", amount: 45, date: "2026-10-20", status: "Settled" },
  { id: "p-1039", merchant: "Delta", agent: "Travel agent", card: "4242", amount: 412.9, date: "2026-10-19", status: "Declined" },
  { id: "p-1038", merchant: "Instacart", agent: "Groceries agent", card: "1881", amount: 64.75, date: "2026-10-18", status: "Settled" },
  { id: "p-1037", merchant: "Notion", agent: "Software agent", card: "3007", amount: 16, date: "2026-10-17", status: "Settled" },
  { id: "p-1036", merchant: "Marriott", agent: "Travel agent", card: "5510", amount: 238, date: "2026-10-16", status: "Settled" },
  { id: "p-1035", merchant: "Trader Joe's", agent: "Groceries agent", card: "1881", amount: 58.2, date: "2026-10-15", status: "Settled" },
  { id: "p-1034", merchant: "Vercel", agent: "Software agent", card: "3007", amount: 20, date: "2026-10-14", status: "Settled" },
  { id: "p-1033", merchant: "Uber", agent: "Travel agent", card: "5510", amount: 31.6, date: "2026-10-13", status: "Settled" },
  { id: "p-1032", merchant: "Costco", agent: "Groceries agent", card: "1881", amount: 143.05, date: "2026-10-12", status: "Settled" },
  { id: "p-1031", merchant: "Linear", agent: "Software agent", card: "3007", amount: 8, date: "2026-10-11", status: "Settled" },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const COLUMNS: DataTableColumn<Purchase>[] = [
  { id: "merchant", header: "Merchant", accessor: (p) => p.merchant, sortable: true, hideable: false, cell: (p) => <span className="font-medium">{p.merchant}</span> },
  { id: "agent", header: "Agent", accessor: (p) => p.agent, sortable: true },
  { id: "card", header: "Card", accessor: (p) => p.card, cell: (p) => <span className="tabular-nums text-fg-muted">ending {p.card}</span> },
  { id: "date", header: "Date", accessor: (p) => p.date, sortable: true, cell: (p) => day.format(new Date(p.date)) },
  { id: "status", header: "Status", accessor: (p) => p.status, cell: (p) => <span className={p.status === "Declined" ? "text-danger" : p.status === "Pending" ? "text-fg-muted" : undefined}>{p.status}</span> },
  { id: "amount", header: "Amount", accessor: (p) => p.amount, sortable: true, align: "end", cell: (p) => <span className="tabular-nums">{money.format(p.amount)}</span> },
];

export function Site() {
  return <DataTable columns={COLUMNS} data={PURCHASES} getRowId={(p) => p.id} filter={{ placeholder: "Filter purchases" }} pageSize={5} defaultSort={{ id: "date", desc: true }} rowName="purchase" />;
}

export function Selection() {
  const [rows, setRows] = useState(PURCHASES);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <DataTable
      columns={COLUMNS}
      data={rows}
      getRowId={(p) => p.id}
      selectable
      selection={selected}
      onSelectionChange={setSelected}
      pageSize={5}
      pageSizes={[5, 10, 20]}
      filter={{ placeholder: "Filter purchases" }}
      rowName="purchase"
      toolbar={
        <Button
          variant="secondary"
          size="sm"
          className="h-9 px-3 text-body-sm"
          disabled={!selected.length}
          onClick={() => {
            setRows((r) => r.filter((p) => !selected.includes(p.id)));
            setSelected([]);
          }}
        >
          Hide {selected.length || ""} selected
        </Button>
      }
    />
  );
}

export function Empty() {
  return <DataTable columns={COLUMNS} data={[]} getRowId={(p) => p.id} empty="No purchases yet. They appear here when an agent checks out." hideViewOptions rowName="purchase" />;
}
