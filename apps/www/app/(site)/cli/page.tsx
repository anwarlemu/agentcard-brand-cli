import { Window } from "@/components/ui/window";
import { Block, Command, Page, PageIntro } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { APPLY_COMMAND, registryName } from "@www/lib/registry";

export const metadata = { title: "CLI" };

const COMMANDS = [
  ["add <items...>", "Copies library items into a React and Tailwind project, with the theme and what each needs."],
  ["list", "Every library item, by group."],
  ["look <file>", "The brand styling for each element in a file, and the library component that covers it."],
  ["check [files]", "Every style value must be a brand token. Hooks and the pre-commit run it for you."],
  ["review <url>", "Screenshots a screen at desktop and phone width and scores it against the brand's own pages."],
  ["tokens [term]", "The brand tokens, by role."],
];

const FLOW = [
  { name: "swap.step", title: "Swap", body: "Components the app has that match the library (same name, same props) are swapped for the library's. The app is type-checked before and after; any swap that breaks it goes back." },
  { name: "restyle.step", title: "Restyle", body: "Every other value, in CSS, templates, scripts, Tailwind or native code, is converted by its role: a text color to a text token, a card radius to the card radius." },
  { name: "finish.step", title: "Finish", body: "A short task list for the coding agent covers what conversion cannot: the main screens and the shared shell, then a review against the brand." },
  { name: "stay.step", title: "Stay", body: "Hooks for Claude Code, Codex and Cursor, and a pre-commit check, keep every later change on the brand." },
];

export default function CliPage() {
  return (
    <Page>
      <PageIntro eyebrow="CLI" title="One command applies the brand" lead={`Run it in any project: it swaps in library components where the app's own match, restyles everything else, and keeps coding agents on ${registryName}.`}>
        <Command command={APPLY_COMMAND} />
      </PageIntro>

      <Block title="What it does">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((s) => (
            <li key={s.name}>
              <Window name={s.name} className="h-full" bodyClassName="grid content-start gap-2 p-6">
                <h3 className="font-display text-h3 leading-display font-medium tracking-tight">{s.title}</h3>
                <p className="text-body-sm text-fg-muted">{s.body}</p>
              </Window>
            </li>
          ))}
        </ol>
      </Block>

      <Block title="Commands" description="Once installed, the CLI is agentcard-ds in the project.">
        <Window name="agentcard-ds --help" className="mx-auto max-w-(--ds-layout-heading)">
          <dl className="divide-y divide-line-subtle px-5">
            {COMMANDS.map(([cmd, what]) => (
              <div key={cmd} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                <dt className="font-mono text-body-sm text-fg-brand">{cmd}</dt>
                <dd className="text-body-sm text-fg-muted">{what}</dd>
              </div>
            ))}
          </dl>
        </Window>
      </Block>

      <Block title="Add components" description="In a React project on Tailwind 4, add items by name. Files land in components/ui, site, blocks or visuals, honoring a src folder and the @ alias.">
        <Code title="terminal" code={`npx agentcard-ds add button window tabs tooltip\nnpx agentcard-ds add hero pricing faq site-footer`} className="mx-auto max-w-(--ds-layout-heading)" />
      </Block>
    </Page>
  );
}
