import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Site() {
  return (
    <div className="grid max-w-sm gap-4">
      <div className="flex items-center justify-between gap-4">
        <Label variant="control" htmlFor="switch-receipts">Email a receipt for every purchase</Label>
        <Switch id="switch-receipts" defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label variant="control" htmlFor="switch-pause">Pause this card</Label>
        <Switch id="switch-pause" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label variant="control" htmlFor="switch-locked">International purchases</Label>
        <Switch id="switch-locked" disabled />
      </div>
    </div>
  );
}
