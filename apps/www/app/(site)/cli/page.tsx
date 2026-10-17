import { Window } from "@/components/ui/window";
import { Block, Command, Page, PageIntro } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { INSTALL_COMMAND } from "@www/lib/registry";

export const metadata = { title: "CLI" };

const COMMANDS = [
  ["add <items...>", "Copy components, their dependencies and the theme into the project. Requires React and Tailwind 4."],
  ["list", "List the available components, sections, page templates and visuals."],
  ["look <file>", "Show the component and token guidance for the elements in a file."],
  ["tokens [term]", "Find a design token by name or role."],
  ["check [files...]", "Check style values against the design tokens. Use --changed for files changed in Git."],
  ["review <url> --any", "Capture and review a page at desktop and phone widths."],
];

const FLOW = [
  { name: "components", title: "Add components", body: "Read the component’s usage notes and add it by name. The CLI copies the source and installs its dependencies." },
  { name: "implementation", title: "Build the page", body: "Compose the components, use the design tokens for the layout, and connect the controls to real state and actions." },
  { name: "checks", title: "Verify the result", body: "Run the project’s checks, test the interactions, and review the page at desktop and phone widths." },
];

export default function CliPage() {
  return <Page>
    <PageIntro title="CLI" lead="Install the CLI once from the project root. Then use it to add components, find tokens and check your work.">
      <Command command={INSTALL_COMMAND} wrap />
    </PageIntro>

    <Block title="Build a page">
      <ol className="grid gap-4 md:grid-cols-3">
        {FLOW.map((step) => <li key={step.name}><Window name={step.name} className="h-full" bodyClassName="grid content-start gap-2 p-6">
          <h3 className="font-display text-h3 leading-display font-medium tracking-tight">{step.title}</h3>
          <p className="text-body-sm text-fg-muted">{step.body}</p>
        </Window></li>)}
      </ol>
    </Block>

    <Block title="Instructions for coding agents" description="Include this with the page requirements.">
      <Code title="agent instructions" lang="text" code={`Build this page using the Agentcard design system at https://agentcard-ds.vercel.app.
Read the relevant component examples and usage notes before writing code.
Add existing components with the CLI. Use design tokens for custom layout and styling.
Connect every control to its intended behavior. Include validation, loading, empty and error states where needed.
Run the project checks and the CLI token check. Test keyboard interaction and desktop and phone layouts.`} />
    </Block>

    <Block title="Add components" description="After installation, add the components the page needs. These are examples; choose the names from the library. Adding components also installs their dependencies and the theme.">
      <Code title="terminal" code={`npx agentcard-ds add button card field input
npx agentcard-ds add hero section site-header site-footer`} />
    </Block>

    <Block title="Check the implementation" description="Run the token check after edits. Start the local development server before reviewing a page. Visual review does not replace testing the controls.">
      <Code title="terminal" code={`npx agentcard-ds check --changed
npx agentcard-ds review http://localhost:3000 --any`} />
    </Block>

    <Block title="Commands" description="Run commands with npx agentcard-ds after installing the CLI.">
      <Window name="agentcard-ds --help" className="mx-auto max-w-(--ds-layout-heading)">
        <dl className="divide-y divide-line-subtle px-5">
          {COMMANDS.map(([command, description]) => <div key={command} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
            <dt className="font-mono text-body-sm text-fg-brand">{command}</dt>
            <dd className="text-body-sm text-fg-muted">{description}</dd>
          </div>)}
        </dl>
      </Window>
    </Block>

    <Block title="Update an existing interface" description="Running the CLI without a subcommand applies the design system to existing code. It can replace matching components, convert style values and install agent rules and checks. Review the diff before continuing.">
      <Code title="terminal" code={`npx agentcard-ds --dry-run
npx agentcard-ds`} />
    </Block>
  </Page>;
}
