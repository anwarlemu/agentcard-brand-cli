import { FeatureGrid, FeatureLogos, FeaturePowered, FeatureRows } from "@/components/site/feature-rows";
import { Window } from "@/components/ui/window";

// A neutral phone made from brand tokens, standing in for the product's own screen.
function Phone({ title, lines = 3 }: { title: string; lines?: number }) {
  return (
    <div className="w-68 shrink-0 rounded-[var(--ds-space-12)] bg-ink p-2.25 shadow-code">
      <div className="min-h-130 rounded-[calc(var(--ds-space-12)-var(--ds-space-2))] bg-surface px-5 pt-4">
        <div className="mb-6 flex items-center justify-between font-display text-caption">
          <span>9:41</span>
          <span aria-hidden className="h-6 w-21 rounded-pill bg-ink" />
          <span aria-hidden className="h-2.5 w-6 rounded-chip bg-ink" />
        </div>
        <p className="mb-4 font-display text-h4 font-medium tracking-tight">{title}</p>
        <div className="grid gap-2.5">
          {Array.from({ length: lines }, (_, i) => (
            <span key={i} aria-hidden className="h-9 rounded-control border border-hairline bg-subtle" />
          ))}
          <span aria-hidden className="mt-2 h-9 rounded-control bg-ink" />
        </div>
      </div>
    </div>
  );
}

function Logo({ children }: { children: string }) {
  return <span className="font-display text-caption font-medium tracking-tight text-fg">{children}</span>;
}

const ROWS = [
  {
    title: "Store any card",
    description: "Works with any card from any country: consumer, commercial or prepaid.",
    media: <Phone title="Add your card" />,
    footnote: <FeatureLogos logos={["Card one", "Card two", "Card three", "Bank", "Credit union"].map((n) => <Logo key={n}>{n}</Logo>)} more="and more" />,
  },
  {
    title: "Get points",
    description: "Customers keep the points and cash back their cards earn on every purchase.",
    media: <Phone title="Points" lines={2} />,
  },
  {
    title: "Insured up to $250",
    description: "Your customers need to feel safe when buying with their agent. We insure up to $250 for mistakes the agent makes.",
    media: <Phone title="Agent mistake" lines={1} />,
    footnote: (
      <FeaturePowered>
        <span className="font-display text-h5 font-medium tracking-tight">INSURER</span>
      </FeaturePowered>
    ),
  },
  {
    title: "A window, centered",
    description: "A row can hold a window or code instead of a phone.",
    align: "center" as const,
    media: (
      <Window name="activity.log" className="w-full max-w-115" bodyClassName="grid gap-2 p-5">
        <span className="h-3 w-2/3 rounded-chip bg-subtle" />
        <span className="h-3 w-1/2 rounded-chip bg-subtle" />
      </Window>
    ),
  },
];

const SAFETY = [
  { title: "Any messaging platform", description: "Use it if you are building for the web, WhatsApp, iMessage or any other platform.", media: <Phone title="Your agent" /> },
  { title: "Authorize with a passkey", description: "Users approve payments on their own device with their passkey or master password.", media: <Phone title="Approve payment" lines={2} /> },
  { title: "Encrypted cards", description: "Cards are encrypted on the user's device before they're stored.", media: <Phone title="Card saved" lines={1} /> },
  { title: "Integrations with agent browsers", description: "Works with the tools you already use: most agent browsers, e-commerce APIs and messaging APIs.", media: <Phone title="Checkout" /> },
];

export function Site() {
  return (
    <div className="bg-surface px-5 py-16 lg:px-15">
      <h2 className="mb-14 text-center font-display text-h2 leading-heading font-medium tracking-tighter">Explore the Vault</h2>
      <FeatureRows product="Vault" rows={ROWS} />
    </div>
  );
}

export function Grid() {
  return (
    <div className="bg-surface px-5 py-16 lg:px-15">
      <h2 className="mb-14 text-center font-display text-h2 leading-heading font-medium tracking-tighter">Safety comes first</h2>
      <FeatureGrid product="Vault" rows={SAFETY} />
    </div>
  );
}
