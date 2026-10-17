import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Site() {
  return (
    <div className="grid max-w-170 gap-4">
      <Field label="Work email" htmlFor="field-email" required help="We reply within a day.">
        <Input id="field-email" type="email" autoComplete="email" />
      </Field>
      <Field label="Website" htmlFor="field-site" error="Enter a web address, like acme.com.">
        <Input id="field-site" defaultValue="acme" aria-invalid />
      </Field>
    </div>
  );
}
