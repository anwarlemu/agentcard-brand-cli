import { readFileSync } from "node:fs";
import path from "node:path";

import { Window } from "@/components/ui/window";
import { Block, Command, Page, PageIntro } from "@www/components/chrome";
import { Code } from "@www/components/code";

export const metadata = { title: "Theme" };

type Tokens = { site: Record<string, string> };
const tokens = JSON.parse(readFileSync(path.join(process.cwd(), "../../build/tokens.json"), "utf8")) as Tokens;
const isColor = (v: string) => /^#|^rgb|^hsl|^oklch/.test(v);
const colors = Object.entries(tokens.site).filter(([k, v]) => k.startsWith("--ds-color-") && isColor(v));

// The palette first (the blue, ink, paper, sky, white and their mixes), then the roles every component reads, by job.
const GROUPS: { name: string; title: string; test: RegExp }[] = [
  { name: "palette.css", title: "Palette", test: /^--ds-color-(brand|black|white|ink|paper|sky|blue-|heart|tint-|sky-wash)/ },
  { name: "surfaces.css", title: "Surfaces", test: /^--ds-color-bg-/ },
  { name: "text.css", title: "Text", test: /^--ds-color-text-/ },
  { name: "lines.css", title: "Lines and washes", test: /^--ds-color-(border-|wash-|ring-)/ },
  { name: "states.css", title: "Actions and states", test: /^--ds-color-(action-|status-|focus-|chart-|window-)/ },
];

const SCALE = Object.entries(tokens.site).filter(([k]) => /^--ds-text-(display|hero|h[1-5]|body-lg|body|body-sm|caption|micro)$/.test(k));
const DISPLAY = /^--ds-text-(display|hero|h[1-5])$/;
const BIG = /^--ds-text-(display|hero|h1)$/;
const RADII = Object.entries(tokens.site).filter(([k]) => k.startsWith("--ds-radius-") && k !== "--ds-radius-pill");
const SHADOWS = ["key", "key-brand", "pressed", "well", "card", "plan", "raised", "floating", "code"];

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="overflow-hidden rounded-sm border border-hairline bg-surface">
      <div className="h-12 border-b border-line-subtle" style={{ background: `var(${name})` }} />
      <div className="px-3 py-2">
        <p className="truncate font-mono text-caption text-fg">{name.replace("--ds-color-", "")}</p>
        <p className="truncate font-mono text-micro text-fg-subtle">{value}</p>
      </div>
    </div>
  );
}

export default function ThemePage() {
  return (
    <Page>
      <PageIntro eyebrow="Theme" title="One set of tokens, every value" lead="Colors, type, space, radii, shadows and motion come from one file, measured from agentcard.sh as it renders.">
        <Command command="npx agentcard-ds add theme" />
      </PageIntro>

      <Block title="Color" description="One electric blue as a ground and for actions, one ink, one paper, one sky, and white; then the roles every component reads.">
        <div className="grid gap-6">
          {GROUPS.map((g) => {
            const list = colors.filter(([k]) => g.test.test(k) && !GROUPS.slice(0, GROUPS.indexOf(g)).some((p) => p.test.test(k)));
            return (
              <Window key={g.name} name={g.name} bodyClassName="p-4 sm:p-5">
                <p className="mb-3 font-display text-caption tracking-label text-fg-label">{g.title}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {list.map(([name, value]) => (
                    <Swatch key={name} name={name} value={value} />
                  ))}
                </div>
              </Window>
            );
          })}
        </div>
      </Block>

      <Block title="Type" description="Headings, labels, keys and code in Neue Haas Grotesk Display (Helvetica Neue where it is not installed) at 500, tracked tight; text in Inter.">
        <Window name="type.css" bodyClassName="divide-y divide-line-subtle px-5">
          {SCALE.map(([name, value]) => (
            <div key={name} className="grid items-baseline gap-2 py-5 sm:grid-cols-[11rem_1fr]">
              <p className="font-mono text-caption text-fg-subtle">
                {name.replace("--ds-text-", "text-")} <span className="text-fg-faint">{value}</span>
              </p>
              <p className={DISPLAY.test(name) ? "min-w-0 font-display leading-tight font-medium tracking-tight text-balance text-fg" : "min-w-0 text-fg"} style={{ fontSize: `var(${name})` }}>
                {BIG.test(name) ? "Agentcard" : "Let agents buy anything online"}
              </p>
            </div>
          ))}
        </Window>
      </Block>

      <Block title="Shape" description="A 2px tag, a 6px nav key, the 8px key, 12px windows and panels, 20px product cards; the bevel, wells, drops and the hard offsets.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {RADII.map(([name, value]) => (
            <div key={name} className="flex flex-col gap-3">
              <div className="h-20 border border-line-brand bg-blue-5" style={{ borderRadius: `var(${name})` }} />
              <p className="font-mono text-caption text-fg">
                {name.replace("--ds-radius-", "rounded-")} <span className="text-fg-subtle">{value}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {SHADOWS.map((name) => (
            <div key={name} className="flex flex-col gap-3">
              <div className="h-20 rounded-card border border-hairline bg-surface" style={{ boxShadow: `var(--ds-shadow-${name})` }} />
              <p className="font-mono text-caption text-fg">shadow-{name}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Use it" description="The theme item writes the tokens and the Tailwind names that read them. Import both after Tailwind.">
        <Code
          title="app/globals.css"
          code={`@import "tailwindcss";
@import "./styles/tokens.css";
@import "./styles/theme.css";`}
        />
      </Block>
    </Page>
  );
}
