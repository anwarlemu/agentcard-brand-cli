import { Window } from "@/components/ui/window";

export function Site() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Window name="vault-free.plan" bodyClassName="grid gap-2 p-7">
        <h3 className="font-display text-h3 leading-display font-medium tracking-tight">Vault Free</h3>
        <p className="text-body-sm text-fg-muted">Store customers' cards and buy with an agent</p>
      </Window>
      <Window name="vault-enterprise.plan" tone="blue" raised bodyClassName="grid gap-2 p-7">
        <h3 className="font-display text-h3 leading-display font-medium tracking-tight">Vault Enterprise</h3>
        <p className="text-body-sm text-fg-muted">Store customers' cards and buy with an agent</p>
      </Window>
      <div className="grid grid-cols-3 gap-4 sm:col-span-2">
        {(["sage", "rose", "teal"] as const).map((tone) => (
          <Window key={tone} name={`${tone}.case`} tone={tone} bodyClassName="flex h-20 items-center justify-center font-display text-body-sm">
            Customer
          </Window>
        ))}
      </div>
    </div>
  );
}
