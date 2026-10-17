import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ROWS = [
  { merchant: "Delta", card: "Travel agent", date: "Oct 14", amount: "$412.00", status: "Approved" },
  { merchant: "Notion", card: "Ops agent", date: "Oct 13", amount: "$96.00", status: "Approved" },
  { merchant: "Uber", card: "Travel agent", date: "Oct 12", amount: "$31.75", status: "Declined" },
] as const;

export function Site() {
  return (
    <Table className="max-w-3xl">
      <TableHeader>
        <TableRow>
          <TableHead>Merchant</TableHead>
          <TableHead>Card</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.merchant}>
            <TableCell>{row.merchant}</TableCell>
            <TableCell className="text-fg-muted">{row.card}</TableCell>
            <TableCell className="text-fg-muted">{row.date}</TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
            <TableCell className="text-right">
              <Badge variant={row.status === "Approved" ? "success" : "destructive"}>{row.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
