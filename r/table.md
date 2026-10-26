# Table
Responsive table that stacks row content on phones.

Install: npx agentcard-ds add table
Requires: theme, utils
Packages: none
Exports: Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow
Client boundary: not required by this entry file
Reference: Repository reference; public guide pages currently unavailable. agentcard-website src/app/globals.css (.v7-guide-table)


## Usage
Use for purchases, cards, plans or other comparable records. Give each TableCell after the first a label for the mobile layout. Use Badge for statuses.
- Avoid: Zebra stripes
- Avoid: Bold headers
- Avoid: Caps headers
- Avoid: Tables nested in a card or window (the table is its own frame)


## Examples
Example components: npx agentcard-ds add table badge
[Site](https://agentcard-ds.vercel.app/preview/table/Site) | [Compare](https://agentcard-ds.vercel.app/preview/table/Compare)

examples/table.tsx

```tsx
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ROWS = [
  { merchant: "Delta", card: "Travel agent", date: "Oct 14", amount: "$412.00", status: "Approved" },
  { merchant: "Notion", card: "Ops agent", date: "Oct 13", amount: "$96.00", status: "Approved" },
  { merchant: "Uber", card: "Travel agent", date: "Oct 12", amount: "$31.75", status: "Declined" },
] as const;

export function Site() {
  return (
    <Table label="Recent purchases">
      <TableHeader>
        <TableRow>
          <TableHead>Merchant</TableHead>
          <TableHead>Card</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.merchant}>
            <TableCell>{row.merchant}</TableCell>
            <TableCell label="Card" className="text-fg-muted">
              {row.card}
            </TableCell>
            <TableCell label="Date" className="text-fg-muted">
              {row.date}
            </TableCell>
            <TableCell label="Amount" className="text-right">
              {row.amount}
            </TableCell>
            <TableCell label="Status">
              <Badge variant={row.status === "Approved" ? "success" : "destructive"}>{row.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// As in the guides: a comparison, the row names in the first column.
export function Compare() {
  const rows = [
    ["Use when", "Your user pays with their own card (credit, debit or prepaid).", "Your agent needs a new card to finish a payment."],
    ["Chargebacks", "Handled by the issuer.", "Handled by Agentcard."],
    ["KYC", "No", "Yes"],
  ];
  return (
    <Table label="Vault and Issuing compared">
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Topic</span>
          </TableHead>
          <TableHead>Vault</TableHead>
          <TableHead>Issuing</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([topic, vault, issuing]) => (
          <TableRow key={topic}>
            <TableCell className="font-medium">{topic}</TableCell>
            <TableCell label="Vault">{vault}</TableCell>
            <TableCell label="Issuing">{issuing}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

```

## Source

components/ui/table.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// The brand's table (agentcard-website globals.css, .v7-guide-table: the guides' ruled tables). A white frame with a 16
// percent ink hairline and 12px corners; the head on sky, its labels in the 12px display face in blue; 14px Inter rows,
// each with a 14 percent ink rule above it and a rule between columns. It scrolls sideways inside its frame when too
// wide, never the page. On a phone (below 640px) each row stacks: the first cell as its title, then each other cell
// under its column's name in blue (pass `label` to TableCell), the head kept for screen readers.
function Table({ className, label = "Table", ...props }: React.ComponentProps<"table"> & { label?: string }) {
  return (
    <div
      data-slot="table-container"
      role="region"
      aria-label={label}
      tabIndex={0}
      className="relative w-full overflow-x-auto rounded-card border border-hairline bg-surface shadow-guide outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring"
    >
      <table data-slot="table" className={cn("w-full caption-bottom border-collapse text-left text-body-sm leading-normal text-fg max-sm:block", className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("max-sm:sr-only", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("max-sm:block", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("font-display max-sm:block", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("data-[state=selected]:bg-wash-selected max-sm:block max-sm:py-3 max-sm:[&+&]:border-t max-sm:[&+&]:border-line", className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn("bg-sky px-3.5 py-2.5 align-bottom font-display text-caption font-normal whitespace-nowrap text-fg-brand [&+&]:border-l [&+&]:border-line", className)}
      {...props}
    />
  );
}

function TableCell({ className, label, ...props }: React.ComponentProps<"td"> & { label?: string }) {
  return (
    <td
      data-slot="table-cell"
      data-label={label}
      className={cn(
        "min-w-35 border-t border-line px-3.5 py-3 align-top text-body-sm leading-normal text-fg tabular-nums [&+&]:border-l",
        // A phone's stacked row: no rules inside it, the first cell its title, the others under their column's name.
        "max-sm:block max-sm:min-w-0 max-sm:border-0 max-sm:px-3.5 max-sm:py-1 max-sm:text-left max-sm:first:font-medium max-sm:[&+&]:border-l-0",
        "max-sm:data-label:not-first:before:mb-0.5 max-sm:data-label:not-first:before:block max-sm:data-label:not-first:before:font-display max-sm:data-label:not-first:before:text-caption max-sm:data-label:not-first:before:text-fg-brand max-sm:data-label:not-first:before:content-[attr(data-label)]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("px-3.5 py-3 text-left text-body-sm text-fg-muted", className)} {...props} />;
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };

```
