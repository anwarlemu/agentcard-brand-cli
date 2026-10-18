import { readFileSync } from "node:fs";
import path from "node:path";

import { Window } from "@/components/ui/window";
import { Block, Command, Page, PageIntro } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { CLI_COMMAND } from "@www/lib/registry";

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
      <PageIntro title="Design tokens" lead="Use these tokens for colors, typography, spacing, corners, shadows and motion. Components already use them; use the same tokens for custom layouts.">
        <Command command={`${CLI_COMMAND} add theme`} />
      </PageIntro>

      <Block title="Colour" description="Choose tokens by their role: surface, text, border, action or status.">
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

      <Block title="Type" description="Use Neue Haas Grotesk Display for headings and control labels, with Helvetica Neue as the fallback. Use Inter for body text.">
        <Window name="type.css" bodyClassName="divide-y divide-line-subtle px-5">
          {SCALE.map(([name, value]) => (
            <div key={name} className="grid items-baseline gap-2 py-5 sm:grid-cols-[11rem_1fr]">
              <p className="font-mono text-caption text-fg-subtle">
                {name.replace("--ds-text-", "text-")} <span className="text-fg-faint">{value}</span>
              </p>
              <p className={DISPLAY.test(name) ? "min-w-0 font-display leading-tight font-medium tracking-tight text-balance text-fg" : "min-w-0 text-fg"} style={{ fontSize: `var(${name})` }}>
                {BIG.test(name) ? "Agentcard" : "Card details and spending limits"}
              </p>
            </div>
          ))}
        </Window>
      </Block>

      <Block title="Corners and shadows" description="Use the token assigned to the component. Keep the same corner radius and shadow for the same kind of element.">
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

      <Block title="Import the theme" description="The CLI creates _agentcard-ds/brand.css and _agentcard-ds/theme.css beside the main stylesheet and adds the imports below. The brand stylesheet includes the tokens and base styles.">
        <Code
          title="app/globals.css"
          code={`@import "tailwindcss";
@import "./_agentcard-ds/brand.css";
@import "./_agentcard-ds/theme.css";`}
        />
      </Block>
    </Page>
  );
}
