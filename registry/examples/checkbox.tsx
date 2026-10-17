import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MERCHANTS = [
  { id: "airlines", label: "Airlines", checked: true },
  { id: "hotels", label: "Hotels", checked: true },
  { id: "software", label: "Software subscriptions", checked: false },
];

export function Site() {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 font-display text-caption text-fg-muted">What this card can buy</legend>
      {MERCHANTS.map((merchant) => (
        <Label key={merchant.id} htmlFor={`checkbox-${merchant.id}`}>
          <Checkbox id={`checkbox-${merchant.id}`} defaultChecked={merchant.checked} />
          {merchant.label}
        </Label>
      ))}
      <Label htmlFor="checkbox-all" className="mt-2">
        <Checkbox id="checkbox-all" checked="indeterminate" />
        Some categories
      </Label>
      <Label htmlFor="checkbox-disabled">
        <Checkbox id="checkbox-disabled" disabled />
        Cash withdrawals (never allowed)
      </Label>
    </fieldset>
  );
}
