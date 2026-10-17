import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function Site() {
  return (
    <div className="grid max-w-170 gap-4">
      <Field label="What should your agent buy?" htmlFor="textarea-brief" help="A sentence or two is plenty.">
        <Textarea id="textarea-brief" placeholder="Book flights and hotels for the sales team" />
      </Field>
    </div>
  );
}
