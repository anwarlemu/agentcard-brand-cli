import { InstallCommand, SectionHeading, SiteSection } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { APPLY_COMMAND, registryName } from "@www/lib/registry";

export const metadata = { title: "CLI" };

const COMMANDS = [
  ["add <items...>", "Copies library items into a React and Tailwind project, with the theme and what each needs."],
  ["list", "Every library item, by group."],
  ["look <file>", "The brand styling for each element in a file, and the library component that covers it."],
  ["check [files]", "Every style value must be a brand token. Hooks and the pre-commit run it for you."],
  ["review", "Screenshots each main screen and scores it against the brand's own pages."],
  ["tokens", "The brand tokens, by role."],
];

const FLOW = [
  { title: "Swap", body: "Components the app has that match the library (same name, same props) are swapped for the library's. The app is type-checked before and after; any swap that breaks it goes back." },
  { title: "Restyle", body: "Every other value, in CSS, templates, scripts, Tailwind or native code, is converted by its role: a text color to a text token, a card radius to the card radius." },
  { title: "Finish", body: "A short task list for the coding agent covers what conversion cannot: the main screens and the shared shell, then a review against the brand." },
  { title: "Stay", body: "Hooks for Claude Code, Codex and Cursor, and a pre-commit check, keep every later change on the brand." },
];

export default function CliPage() {
  return (
    <main>
      <SiteSection>
        <SectionHeading as="h1" title="One command applies the brand" description={`Run it in any project: it swaps in library components where the app's own match, restyles everything else, and keeps coding agents on ${registryName}.`}>
          <InstallCommand command={APPLY_COMMAND} className="mt-4" />
        </SectionHeading>
      </SiteSection>

      <SiteSection>
        <SectionHeading title="What it does" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-6 shadow-card">
              <span className="font-display text-caption text-fg-label">0{i + 1}</span>
              <span className="font-display text-h3 leading-display font-medium tracking-tight text-fg">{s.title}</span>
              <span className="text-body-sm text-fg-muted">{s.body}</span>
            </li>
          ))}
        </ol>
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Commands" description="Once installed, the CLI is agentcard-ds in the project." />
        <dl className="mx-auto grid max-w-(--ds-layout-heading) divide-y divide-line-subtle">
          {COMMANDS.map(([cmd, what]) => (
            <div key={cmd} className="grid gap-1 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
              <dt className="font-mono text-body-sm text-fg">npx agentcard-ds {cmd}</dt>
              <dd className="text-body-sm text-fg-muted">{what}</dd>
            </div>
          ))}
        </dl>
      </SiteSection>

      <SiteSection>
        <SectionHeading title="Add components" description="In a React project on Tailwind 4, add items by name. Files land in components/ui, site, blocks or visuals, honoring a src folder and the @ alias." />
        <Code title="terminal" code={`npx agentcard-ds add button window tabs tooltip\nnpx agentcard-ds add hero pricing faq site-footer`} />
      </SiteSection>
    </main>
  );
}
