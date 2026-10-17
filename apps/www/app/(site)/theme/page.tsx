import { readFileSync } from "node:fs";
import path from "node:path";

import { InstallCommand, SectionHeading, SiteSection } from "@www/components/chrome";
import { Code } from "@www/components/code";

export const metadata = { title: "Theme" };

type Tokens = { site: Record<string, string> };
const tokens = JSON.parse(readFileSync(path.join(process.cwd(), "../../build/tokens.json"), "utf8")) as Tokens;
const isColor = (v: string) => /^#|^rgb|^hsl|^oklch/.test(v);
const colors = Object.entries(tokens.site).filter(([k, v]) => k.startsWith("--ds-color-") && isColor(v));

// The core palette first (the blue, ink, paper, sky, white and their mixes), then the roles every component reads.
const CORE = /^--ds-color-(brand|black|white|ink|paper|sky|blue-|heart|tint-|sky-wash)/;
const core = colors.filter(([k]) => CORE.test(k));
const roles = colors.filter(([k]) => !CORE.test(k));

const SCALE = Object.entries(tokens.site).filter(([k]) => /^--ds-text-(display|hero|h[1-5]|body-lg|body|body-sm|caption|micro)$/.test(k));
const DISPLAY = /^--ds-text-(display|hero|h[1-5])$/;
const RADII = Object.entries(tokens.site).filter(([k]) => k.startsWith("--ds-radius-") && k !== "--ds-radius-pill");
const SHADOWS = ["key", "key-brand", "pressed", "well", "card", "raised", "floating", "code"];

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-hairline bg-surface">
      <div className="h-14 border-b border-line-subtle" style={{ background: `var(${name})` }} />
      <div className="px-3 py-2">
        <p className="truncate font-mono text-caption text-fg">{name.replace("--ds-color-", "")}</p>
        <p className="truncate font-mono text-caption text-fg-subtle">{value}</p>
      </div>
    </div>
  );
}

export default function ThemePage() {
  return (
    <main>
      <SiteSection>
        <SectionHeading as="h1" title="One set of tokens, every value" description="Colors, type, space, radii, shadows and motion come from one file, measured from agentcard.sh as it renders.">
          <InstallCommand command="npx agentcard-ds add theme" className="mt-4" />
        </SectionHeading>
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Color" description="One electric blue as a ground and for actions, one ink, one paper, one sky, and white; then the roles every component reads." />
        <div className="grid gap-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {core.map(([name, value]) => (
              <Swatch key={name} name={name} value={value} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {roles.map(([name, value]) => (
              <Swatch key={name} name={name} value={value} />
            ))}
          </div>
        </div>
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Type" description="Headings, labels, keys and code in Neue Haas Grotesk Display (Helvetica Neue where it is not installed) at 500, tracked tight; text in Inter." />
        <div className="grid divide-y divide-line-subtle">
          {SCALE.map(([name, value]) => (
            <div key={name} className="grid items-baseline gap-2 py-4 sm:grid-cols-[10rem_1fr]">
              <p className="font-mono text-caption text-fg-subtle">
                {name.replace("--ds-text-", "text-")} <span className="text-fg-faint">{value}</span>
              </p>
              <p className={DISPLAY.test(name) ? "truncate font-display leading-tight font-medium tracking-tight text-fg" : "truncate text-fg"} style={{ fontSize: `var(${name})` }}>
                Let agents buy anything online
              </p>
            </div>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Shape" description="A 2px tag, a 6px nav key, the 8px key, 12px windows and panels, 20px product cards; and the bevel, wells, drops and the hard offset." />
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
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {SHADOWS.map((name) => (
            <div key={name} className="flex flex-col gap-3">
              <div className="h-20 rounded-card border border-hairline bg-surface" style={{ boxShadow: `var(--ds-shadow-${name})` }} />
              <p className="font-mono text-caption text-fg">shadow-{name}</p>
            </div>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Use it" description="The theme item writes the tokens and the Tailwind names that read them. Import both after Tailwind." />
        <Code
          title="app/globals.css"
          code={`@import "tailwindcss";
@import "./styles/tokens.css";
@import "./styles/theme.css";`}
        />
      </SiteSection>
    </main>
  );
}
