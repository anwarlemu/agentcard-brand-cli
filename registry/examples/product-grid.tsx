import { ArrowUpRight } from "lucide-react";

import { ProductGrid } from "@/components/site/product-grid";
import { Window } from "@/components/ui/window";

// Neutral stand-ins for the brand's pictures (3D cards, keycaps, screens), drawn from tokens so the layout reads.
function Cards() {
  return (
    <div className="relative h-56 w-80">
      <div className="absolute inset-x-6 top-16 h-32 -rotate-2 rounded-card border border-hairline bg-surface shadow-tile" />
      <div className="absolute inset-x-4 top-8 h-32 rotate-1 rounded-card bg-blue-mid shadow-tile" />
      <div className="absolute inset-x-2 top-0 flex h-32 -rotate-3 flex-col justify-between rounded-card bg-inverse p-4 text-on-brand shadow-tile">
        <span className="font-display text-body-sm">agentcard</span>
        <span className="self-end font-display text-caption">···· 4832</span>
      </div>
    </div>
  );
}

function Keys() {
  const tints = ["bg-tint-peach", "bg-sky", "bg-tint-teal", "bg-tint-rose", "bg-tint-sage"];
  return (
    <div className="grid grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i} className={`size-10 rounded-card md:size-14 border border-hairline shadow-key ${tints[(i * 2) % tints.length]}`} />
      ))}
    </div>
  );
}

function Screen({ name, rows }: { name: string; rows: string[] }) {
  return (
    <Window name={name} className="w-full max-w-md -rotate-1">
      <ul className="grid gap-2 p-4 text-caption">
        {rows.map((row) => (
          <li key={row} className="flex items-center justify-between rounded-sm border border-hairline px-3 py-2">
            {row}
            <span className="rounded-chip bg-sky px-1.5 text-micro text-fg-brand">Active</span>
          </li>
        ))}
      </ul>
    </Window>
  );
}

export function Site() {
  return (
    <section className="mx-auto w-full max-w-(--ds-frame-column) py-20">
      <div className="mx-auto mb-18 max-w-(--ds-layout-heading) text-center max-lg:mb-10">
        <h2 className="font-display text-h2 leading-heading font-medium tracking-tighter">Explore our products</h2>
        <p className="mt-3.5 text-body-lg leading-6.5 tracking-tight opacity-70">Vault, Issuing, Voice and the Purchase Agent: what an agent needs to pay for things.</p>
      </div>
      <ProductGrid
        products={[
          { layout: "lead", title: "Vault", description: "Store customers’ cards and make purchases with agents safely.", action: { label: "Explore Vault", href: "https://www.agentcard.sh/vault" }, media: <Cards /> },
          {
            layout: "half",
            title: "Purchase Agent",
            description: "Integrate our agent into yours and enable purchases from Amazon, DoorDash and many other online stores.",
            action: { label: "Read the docs", href: "https://docs.agentcard.sh", icon: <ArrowUpRight /> },
            media: <Keys />,
          },
          { layout: "half", title: "Issuing", description: "Create one-time and multi-use cards for your agent.", action: { label: "Explore Issuing", href: "https://www.agentcard.sh/issuing" }, media: <Screen name="issuing.product" rows={["Agentcard ···· 4832", "Agentcard ···· 7719", "Agentcard ···· 2051"]} /> },
          { layout: "lead", title: "Voice", description: "Let customers approve their agent’s purchases by speaking, with no screen to look at.", action: { label: "Explore Voice", href: "https://cal.com/team/agentcard/agentcard-call" }, media: <Screen name="voice.product" rows={["Your usual from Rose Indian, $34.20", "Approved"]} /> },
        ]}
      />
    </section>
  );
}
