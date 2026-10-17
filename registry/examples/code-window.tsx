import { CodeWindow } from "@/components/ui/code-window";

const KERNEL = `// One card item per purchase, in the
// user's KERNEL vault
await kernel.vaults.items.upsert('order', {
  type: 'card',
  spec: { provider: 'agentcard',
    merchant: 'amazon.com',
    amount: 2306, currency: 'usd' },
});
const browser = await kernel.browsers.create({
  vaults: [{ id: vault.id }],
});`;

const LINQ = `POST api.linqapp.com/…/v3/payments

{ "handle": "+1 415 555 0134",
  "amount": 2306,
  "merchant": "amazon.com" }`;

// On the blue panel, as on the home page's integrations stage.
export function Site() {
  return (
    <div className="mx-auto flex min-h-105 max-w-162 items-center rounded-panel bg-brand p-[clamp(var(--ds-space-4),2.4vw,var(--ds-space-8))]">
      <CodeWindow title="kernel.ts" language="ts" code={KERNEL} copy className="w-full sm:w-[88%]" preClassName="pb-15" />
    </div>
  );
}

// On white, with a copy key and a request instead of code.
export function Request() {
  return <CodeWindow title="payments.http" language="http" code={LINQ} copy className="max-w-xl" />;
}
