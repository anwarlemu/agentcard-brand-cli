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
