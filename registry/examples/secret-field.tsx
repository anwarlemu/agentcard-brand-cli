import { SecretField } from "@/components/ui/secret-field";

export function Site() {
  return (
    <div className="grid max-w-md gap-2">
      <p className="font-display text-caption text-fg-muted">API key</p>
      <SecretField secret="ac_live_7Hq2mX9pLw4vR8sN3kTz" label="API key" />
    </div>
  );
}
