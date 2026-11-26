# Data Table
The brand's ruled table with a search field, sortable heads, row selection, a Columns menu and page keys.

Install: npx agentcard-ds add data-table
Requires: theme, button, checkbox, dropdown-menu, input, pagination, select, table, utils
Packages: lucide-react
Exports: DataTable, DataTableColumnHeader, DataTablePagination, DataTableViewOptions, DataTableColumn, DataTableProps, SortState
Client boundary: yes
Reference: Built on table.tsx (agentcard-website .v7-guide-table)


## Usage
Use for records people sort, filter and act on (purchases, cards, agents). Pass columns (header, accessor, cell, sortable), data and getRowId. Add selectable for bulk actions and pageSizes to let people choose rows per page; put actions in toolbar.
- Avoid: Animating sorting or paging
- Avoid: Hiding the only identifying column
- Avoid: More than one table per page without headings


## Examples
Example components: npx agentcard-ds add data-table button
[Site](https://agentcard-ds.vercel.app/preview/data-table/Site) | [Selection](https://agentcard-ds.vercel.app/preview/data-table/Selection) | [Empty](https://agentcard-ds.vercel.app/preview/data-table/Empty)

examples/data-table.tsx

```tsx
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

```

## Source

components/ui/data-table.tsx

```tsx
"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Columns3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// A table of records people sort, filter, select and page through, built on the brand's table (table.tsx, the guides'
// ruled tables: a white frame with a 16 percent ink hairline and 12px corners, the head on sky with blue 12px
// display-face labels, 14px rows ruled at 14 percent ink, stacking into cards on a phone). A sortable head label is a
// quiet key with an arrow for its direction; a selected row takes the faint blue wash. Above it, a toolbar: the brand's
// search field (36px, 8px corners, a magnifying glass) and the white Columns key that opens the brand's menu of
// checkboxes. Under it, a row with the selection count, rows per page and the page keys. Sorting, filtering and paging
// are instant (no motion): they are repeated many times in a row.

type Value = string | number | Date | boolean | null | undefined;

type DataTableColumn<T> = {
  id: string;
  /** The column's label, in its head and in the Columns menu. */
  header: React.ReactNode;
  /** What the cell shows; defaults to the accessor's value. */
  cell?: (row: T) => React.ReactNode;
  /** The value used to sort and filter. */
  accessor?: (row: T) => Value;
  sortable?: boolean;
  /** Whether the Columns menu can hide it (default true). */
  hideable?: boolean;
  /** Hidden until turned on in the Columns menu. */
  hidden?: boolean;
  align?: "start" | "end";
  className?: string;
};

type SortState = { id: string; desc: boolean } | null;

const text = (v: Value) => (v instanceof Date ? v.toISOString() : v == null ? "" : String(v));
function compare(a: Value, b: Value) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return text(a).localeCompare(text(b), undefined, { numeric: true, sensitivity: "base" });
}

/** A sortable head label: a ghost key whose arrow shows the direction (both carets while unsorted). */
function DataTableColumnHeader({ title, sorted, onSort, className }: { title: React.ReactNode; sorted: false | "asc" | "desc"; onSort?: () => void; className?: string }) {
  if (!onSort) return <span className={className}>{title}</span>;
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <button
      type="button"
      data-slot="data-table-column-header"
      onClick={onSort}
      className={cn("-mx-1.5 -my-1 inline-flex items-center gap-1 rounded-sm px-1.5 py-1 font-display text-caption font-normal text-fg-brand outline-none transition-[background-color] duration-150 ease-out hover:bg-wash-selected focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring data-[sorted=true]:font-medium motion-reduce:transition-none", className)}
      data-sorted={!!sorted}
    >
      {title}
      <Icon aria-hidden strokeWidth={sorted ? 2 : 1.5} className={cn("size-3", !sorted && "opacity-60")} />
    </button>
  );
}

/** The Columns key and its menu of checkboxes, one per column that can be hidden. */
function DataTableViewOptions({ columns, visible, onVisibleChange }: { columns: { id: string; header: React.ReactNode }[]; visible: Record<string, boolean>; onVisibleChange: (id: string, on: boolean) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="h-9 shrink-0 px-3 text-body-sm">
          <Columns3 strokeWidth={1.5} />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((c) => (
          <DropdownMenuCheckboxItem key={c.id} checked={visible[c.id] !== false} onCheckedChange={(on) => onVisibleChange(c.id, on === true)} onSelect={(e) => e.preventDefault()}>
            {c.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The page numbers around the current one: the ends, its neighbors and ellipses between. */
function pageList(page: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);
  const set = new Set([0, count - 1, page - 1, page, page + 1].filter((p) => p >= 0 && p < count));
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i && p - sorted[i - 1] > 1 ? (["gap", p] as const) : [p]));
}

/** The row under the table: the selection count, rows per page and the page keys. */
function DataTablePagination({ page, pageCount, onPageChange, pageSize, pageSizes, onPageSizeChange, selected, total, className }: { page: number; pageCount: number; onPageChange: (page: number) => void; pageSize?: number; pageSizes?: number[]; onPageSizeChange?: (size: number) => void; selected?: number; total?: number; className?: string }) {
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (p >= 0 && p < pageCount) onPageChange(p);
  };
  return (
    <Pagination className={cn("flex-wrap justify-between gap-x-4 gap-y-2", className)}>
      <div className="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1 font-display text-caption text-fg-muted">
        {selected !== undefined && total !== undefined && (
          <span aria-live="polite" className="tabular-nums">
            {selected} of {total} selected
          </span>
        )}
        {pageSizes && pageSize && onPageSizeChange && (
          <span className="flex items-center gap-2">
            <span id="data-table-page-size">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger compact aria-labelledby="data-table-page-size" className="w-18">
                <SelectValue />
              </SelectTrigger>
              <SelectContent compact>
                {pageSizes.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        )}
      </div>
      <PaginationContent className="ml-auto">
        <PaginationItem>
          <PaginationPrevious href="#" onClick={go(page - 1)} aria-disabled={page === 0 || undefined} tabIndex={page === 0 ? -1 : undefined} />
        </PaginationItem>
        {pageList(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === page} onClick={go(p)} aria-label={`Page ${p + 1}`}>
                {p + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext href="#" onClick={go(page + 1)} aria-disabled={page >= pageCount - 1 || undefined} tabIndex={page >= pageCount - 1 ? -1 : undefined} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  /** A filter field over these columns' values (all filterable columns when omitted). */
  filter?: { placeholder?: string; columns?: string[] } | false;
  /** A checkbox column for choosing rows. */
  selectable?: boolean;
  selection?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Hide the Columns key. */
  hideViewOptions?: boolean;
  pageSize?: number;
  /** Offer these page sizes under the table. */
  pageSizes?: number[];
  defaultSort?: SortState;
  /** Shown in the body when nothing matches. */
  empty?: React.ReactNode;
  /** Actions at the toolbar's right, before the Columns key. */
  toolbar?: React.ReactNode;
  /** What a row is called in labels ("mailbox"). */
  rowName?: string;
  className?: string;
};

function DataTable<T>({ columns, data, getRowId, filter = {}, selectable = false, selection: selectionProp, onSelectionChange, hideViewOptions = false, pageSize: pageSizeProp = 10, pageSizes, defaultSort = null, empty = "No results.", toolbar, rowName = "row", className }: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortState>(defaultSort);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(pageSizeProp);
  const [visible, setVisible] = React.useState<Record<string, boolean>>(() => Object.fromEntries(columns.map((c) => [c.id, !c.hidden])));
  const [selectionInner, setSelectionInner] = React.useState<string[]>([]);
  const selection = selectionProp ?? selectionInner;
  const setSelection = (ids: string[]) => {
    if (!selectionProp) setSelectionInner(ids);
    onSelectionChange?.(ids);
  };

  const shown = columns.filter((c) => visible[c.id] !== false);
  const filterColumns = filter ? columns.filter((c) => c.accessor && (!filter.columns || filter.columns.includes(c.id))) : [];

  const q = query.trim().toLowerCase();
  let rows = q ? data.filter((row) => filterColumns.some((c) => text(c.accessor!(row)).toLowerCase().includes(q))) : data;
  const sortColumn = sort && columns.find((c) => c.id === sort.id);
  if (sort && sortColumn?.accessor) {
    const get = sortColumn.accessor;
    rows = [...rows].sort((a, b) => compare(get(a), get(b)) * (sort.desc ? -1 : 1));
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(current * pageSize, current * pageSize + pageSize);
  const pageIds = pageRows.map(getRowId);
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selection.includes(id));
  const someOnPage = pageIds.some((id) => selection.includes(id));

  const toggleSort = (id: string) => setSort((s) => (s?.id !== id ? { id, desc: false } : s.desc ? null : { id, desc: true }));

  return (
    <div data-slot="data-table" className={cn("grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3", className)}>
      {(filter || !hideViewOptions || toolbar) && (
        <div data-slot="data-table-toolbar" className="flex flex-wrap items-center gap-2">
          {filter && (
            <Input
              variant="search"
              className="max-w-80 min-w-48 flex-1"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder={filter.placeholder ?? "Filter"}
              aria-label={filter.placeholder ?? "Filter"}
            />
          )}
          <div className="ml-auto flex items-center gap-2">
            {toolbar}
            {!hideViewOptions && (
              <DataTableViewOptions
                columns={columns.filter((c) => c.hideable !== false)}
                visible={visible}
                onVisibleChange={(id, on) => setVisible((v) => ({ ...v, [id]: on }))}
              />
            )}
          </div>
        </div>
      )}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox
                    aria-label={`Select every ${rowName} on this page`}
                    checked={allOnPage ? true : someOnPage ? "indeterminate" : false}
                    onCheckedChange={(on) => setSelection(on === true ? [...new Set([...selection, ...pageIds])] : selection.filter((id) => !pageIds.includes(id)))}
                  />
                </TableHead>
              )}
              {shown.map((c) => (
                <TableHead key={c.id} aria-sort={sort?.id === c.id ? (sort.desc ? "descending" : "ascending") : c.sortable ? "none" : undefined} className={cn(c.align === "end" && "text-right", c.className)}>
                  <DataTableColumnHeader title={c.header} sorted={sort?.id === c.id ? (sort.desc ? "desc" : "asc") : false} onSort={c.sortable && c.accessor ? () => toggleSort(c.id) : undefined} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row) => {
                const id = getRowId(row);
                const selected = selection.includes(id);
                return (
                  <TableRow key={id} data-state={selected ? "selected" : undefined}>
                    {selectable && (
                      <TableCell className="w-10 min-w-0">
                        <Checkbox aria-label={`Select ${rowName} ${id}`} checked={selected} onCheckedChange={(on) => setSelection(on === true ? [...selection, id] : selection.filter((s) => s !== id))} />
                      </TableCell>
                    )}
                    {shown.map((c) => (
                      <TableCell key={c.id} className={cn(c.align === "end" && "text-right", c.className)}>
                        {c.cell ? c.cell(row) : text(c.accessor?.(row))}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={shown.length + (selectable ? 1 : 0)} className="h-24 text-center align-middle whitespace-normal text-fg-muted">
                  {empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination
          className="mt-3"
          page={current}
          pageCount={pageCount}
          onPageChange={setPage}
          pageSize={pageSize}
          pageSizes={pageSizes}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(0);
          }}
          selected={selectable ? selection.length : undefined}
          total={selectable ? data.length : undefined}
        />
      </div>
    </div>
  );
}

export { DataTable, DataTableColumnHeader, DataTablePagination, DataTableViewOptions };
export type { DataTableColumn, DataTableProps, SortState };

```
