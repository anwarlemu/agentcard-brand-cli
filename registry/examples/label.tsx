import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Site() {
  return <div className="grid max-w-sm gap-4">
    <div className="grid gap-1.5">
      <Label htmlFor="label-company">Company</Label>
      <Input id="label-company" name="company" placeholder="Acme" />
    </div>
    <Label variant="control"><Checkbox defaultChecked />Email me a receipt for every purchase</Label>
    <div className="flex items-center justify-between gap-4">
      <Label variant="control" htmlFor="label-switch">Pause this card</Label>
      <Switch id="label-switch" />
    </div>
  </div>;
}
