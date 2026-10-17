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
        {(
          [
            ["sage", "Orchid"],
            ["rose", "Fieldwork"],
            ["teal", "Northwind"],
          ] as const
        ).map(([tone, customer]) => (
          <Window key={tone} name="" tone={tone} bodyClassName="flex min-h-21 items-center justify-center font-display text-h4 tracking-tight">
            {customer}
          </Window>
        ))}
      </div>
    </div>
  );
}
