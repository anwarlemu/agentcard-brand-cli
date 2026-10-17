import { AppWindow, Bold, CircleDashed, MessageSquare, Triangle, Zap } from "lucide-react";

import { IntegrationCode, IntegrationScreen, Integrations } from "@/components/site/integrations";

function Field({ title, detail, status }: { title: string; detail: string; status: string }) {
  return (
    <div className="flex items-center gap-2 rounded-chip border border-line-on-brand-strong bg-[color-mix(in_srgb,var(--ds-color-white)_55%,transparent)] px-2.5 py-2 text-fg">
      <span className="grid">
        <b className="font-medium">{title}</b>
        <small className="text-micro text-fg-muted">{detail}</small>
      </span>
      <em className="ml-auto rounded-chip bg-sky px-1.5 py-0.5 text-micro not-italic text-fg-brand">{status}</em>
    </div>
  );
}

function Browser(tool: string, code: string) {
  return (
    <>
      <IntegrationCode name={`${tool.toLowerCase()}.ts`}>{code}</IntegrationCode>
      <IntegrationScreen name={tool.toUpperCase()} address="vault · user-12345">
        <Field title="Agentcard" detail="Wallet" status="Connected" />
        <Field title="Order" detail="Card · $23.06 at amazon.com" status="Authorizing" />
        <p className="text-micro opacity-80">{tool} swaps the card in at its network edge</p>
      </IntegrationScreen>
    </>
  );
}

const CODE = `// One card item per purchase, in the
// user's vault
await client.vaults.items.upsert('order', {
  type: 'card',
  spec: { provider: 'agentcard',
    merchant: 'amazon.com',
    amount: 2306, currency: 'usd' },
});`;

export function Site() {
  return (
    <section className="mx-auto w-full max-w-(--ds-frame-column) py-20">
      <div className="mx-auto mb-9 max-w-(--ds-layout-heading) text-center">
        <h2 className="font-display text-h2 leading-heading font-medium tracking-tighter">Integrates natively with the tools you use</h2>
        <p className="mt-3.5 text-body-lg leading-6.5 tracking-tight opacity-70">Kernel, Browserbase, Browser Use, Anchor, your own browser, Linq and Blooio: the stack your agent already runs on.</p>
      </div>
      <Integrations
        rows={[
          {
            title: "Browser integrations",
            description: "Integrate with Kernel, Browserbase, Browser Use, Anchor or your own browser and automate purchases online.",
            options: [
              { label: "Kernel", icon: <Zap />, panel: Browser("Kernel", CODE) },
              { label: "Browserbase", icon: <Bold />, panel: Browser("Browserbase", CODE.replace("client", "bb")) },
              { label: "Browser Use", icon: <CircleDashed />, panel: Browser("Browser Use", CODE.replace("client", "browser")) },
              { label: "Anchor", icon: <Triangle />, panel: Browser("Anchor", CODE.replace("client", "anchor")) },
              { label: "Your own browser", icon: <AppWindow />, panel: Browser("Browser", CODE) },
            ],
          },
          {
            title: "Messaging integrations",
            description: "iMessage agents built on top of Linq and Blooio can use Agentcard to complete payments.",
            options: ["Linq", "Blooio"].map((tool) => ({
              label: tool,
              icon: <MessageSquare />,
              panel: (
                <>
                  <IntegrationCode name={`${tool.toLowerCase()} payments`}>{`POST api.${tool.toLowerCase()}.com/v3/payments\n\n{ "amount": 2306,\n  "currency": "usd",\n  "merchant": "amazon.com" }`}</IntegrationCode>
                  <IntegrationScreen>
                    <p className="w-fit rounded-card bg-surface px-3 py-1.5 text-fg">Found it. Ready to check out?</p>
                    <p className="ml-auto w-fit rounded-card bg-brand px-3 py-1.5">Approved</p>
                  </IntegrationScreen>
                </>
              ),
            })),
          },
        ]}
      />
    </section>
  );
}
