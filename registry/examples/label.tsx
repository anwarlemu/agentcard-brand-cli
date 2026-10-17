import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Site() {
  return (
    <div className="grid max-w-sm gap-4">
      <Label>
        <Checkbox defaultChecked />
        Email me a receipt for every purchase
      </Label>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="label-switch">Pause this card</Label>
        <Switch id="label-switch" />
      </div>
    </div>
  );
}
