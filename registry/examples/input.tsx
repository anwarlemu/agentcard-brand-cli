import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Site() {
  return (
    <div className="grid max-w-170 gap-4">
      <Field label="Your name" htmlFor="input-name">
        <Input id="input-name" autoComplete="name" />
      </Field>
      <Field label="Work email" htmlFor="input-email">
        <Input id="input-email" type="email" autoComplete="email" />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company" htmlFor="input-company">
          <Input id="input-company" />
        </Field>
        <Field label="Website" htmlFor="input-site">
          <Input id="input-site" placeholder="acme.com" />
        </Field>
      </div>
    </div>
  );
}

export function States() {
  return (
    <div className="grid max-w-170 gap-4">
      <Field label="Work email" htmlFor="input-invalid" error="Use your work email, not a personal one.">
        <Input id="input-invalid" type="email" defaultValue="ada@gmail.com" aria-invalid />
      </Field>
      <Field label="Card nickname" htmlFor="input-disabled" help="Set by your team admin.">
        <Input id="input-disabled" defaultValue="Travel agent" disabled />
      </Field>
    </div>
  );
}

export function Search() {
  return (
    <div className="max-w-80">
      <Input variant="search" placeholder="Search the guides" aria-label="Search the guides" />
    </div>
  );
}
