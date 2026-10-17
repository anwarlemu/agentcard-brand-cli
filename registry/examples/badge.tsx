import { Badge } from "@/components/ui/badge";

export function Site() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="tag">Added</Badge>
        <Badge variant="tag-ink">Improved</Badge>
        <Badge variant="tag-heart">Fixed</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Pending</Badge>
        <Badge variant="brand">In review</Badge>
        <Badge variant="success">Approved</Badge>
        <Badge variant="warning">Low balance</Badge>
        <Badge variant="destructive">Declined</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="chip">Prepaid</Badge>
        <Badge variant="chip">Commercial</Badge>
        <Badge variant="chip">12 merchants</Badge>
      </div>
    </div>
  );
}
