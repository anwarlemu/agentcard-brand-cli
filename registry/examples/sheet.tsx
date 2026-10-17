import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const PURCHASES = [
  { merchant: "Delta", amount: "$412.00", status: "Approved" },
  { merchant: "Marriott", amount: "$238.40", status: "Approved" },
  { merchant: "Uber", amount: "$31.75", status: "Declined" },
];

function PurchaseLog({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Purchase log</Button>
      </SheetTrigger>
      <SheetContent name="purchase.log">
        <SheetHeader>
          <SheetTitle>Travel agent</SheetTitle>
          <SheetDescription>Every purchase this card made, newest first.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <ul>
            {PURCHASES.map((p) => (
              <li key={p.merchant} className="flex items-center justify-between gap-4 border-b border-line py-3.5">
                <span className="font-display text-body-sm">{p.merchant}</span>
                <span className="flex items-center gap-3">
                  <span className="text-body-sm tabular-nums">{p.amount}</span>
                  <Badge variant={p.status === "Approved" ? "success" : "destructive"}>{p.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export function Site() {
  return <PurchaseLog />;
}

export function Open() {
  return (
    <div className="h-130">
      <PurchaseLog defaultOpen />
    </div>
  );
}
