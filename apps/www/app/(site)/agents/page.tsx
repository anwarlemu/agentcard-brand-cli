import Link from "next/link";
import { Block, Page, PageIntro } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { INSTALL_COMMAND } from "@www/lib/registry";

export const metadata = { title: "Agent instructions", description: "Setup, component references and verification steps for any coding agent.", alternates: { canonical: "/agents", types: { "text/markdown": "/agents.md" } } };

const REFERENCES = [
  ["/agents.md", "Agent guide", "Read this first. Setup, composition, form behavior and verification."],
  ["/llms.txt", "Text catalog", "Find the relevant component references without loading the UI."],
  ["/r/index.json", "Registry JSON", "All components, helpers, dependencies and reference links."],
  ["/llms-full.txt", "Complete reference", "The guide, examples and source in one file. Use individual references for smaller context."],
];

export default function AgentsPage() {
  return <Page>
    <PageIntro title="Agent instructions" lead="Use these instructions with any coding agent. Read the relevant component source and examples, then build to the page requirements." />
    <Block title="Give the agent the brief" description="Include the required content and behavior. The guide covers how to apply the design system.">
      <Code title="agent instructions" lang="text" code={`Build this interface with the Agentcard design system.
Read https://agentcard-ds.vercel.app/agents.md first.
Use the component references linked there for exact props, examples and source.
Follow the page requirements, connect the controls, and verify the result.

Page requirements:
[Describe the page, its content and what each action should do.]`} />
    </Block>
    <Block title="Prepare the project" description="From the consuming project root, install the CLI and run init. This sets up styles, fonts and project instructions without converting existing components. React components require React, Tailwind CSS 4 and an @/* source alias; the CLI requires Node.js 20 or later.">
      <Code title="terminal" code={`${INSTALL_COMMAND}
npx agentcard-ds init
npx agentcard-ds guide`} />
    </Block>
    <Block title="Read, then compose" description="Choose components from the inventory. Inspect their exports, usage rules and working examples before adding them. The commands below use Select as an example.">
      <Code title="terminal" code={`npx agentcard-ds list --json
npx agentcard-ds show select --json
npx agentcard-ds add field select button --dry-run --json
npx agentcard-ds add field select button --json`} />
      <p className="mx-auto mt-6 max-w-(--ds-layout-heading) text-body-sm leading-relaxed text-fg-muted">These references also work over HTTP: read <a className="text-fg-brand underline" href="/r/select.md" target="_blank" rel="noreferrer">Select as text</a> or <a className="text-fg-brand underline" href="/r/select.json" target="_blank" rel="noreferrer">Select as JSON</a>. JSON includes exact source, example code and transitive dependency names. The CLI resolves and installs those dependencies.</p>
    </Block>
    <Block title="Verify the interface" description="Run the project’s type checks, tests and build, then the token check. Test controls with mouse and keyboard, submit invalid and valid forms, and check desktop and phone layouts. A clean token check does not prove behavior or visual correctness.">
      <Code title="terminal" code={`npx agentcard-ds check --json
npx agentcard-ds review http://localhost:3000 --any`} />
      <p className="mx-auto mt-6 max-w-(--ds-layout-heading) text-body-sm leading-relaxed text-fg-muted">Start the local server before review. Review needs Chromium and an available reviewer for automated scoring; otherwise inspect the saved screenshots and report a manual review. Read the <Link className="text-fg-brand underline" href="/cli">CLI reference</Link> before converting an existing interface.</p>
    </Block>
    <Block title="References for agents" description="The text and JSON references are generated from the same source that the CLI installs. No browser or agent-specific integration is required to read them.">
      <dl className="mx-auto max-w-(--ds-layout-heading) divide-y divide-line-subtle">
        {REFERENCES.map(([href, title, description]) => <div key={href} className="py-5"><dt><a className="font-display text-h4 text-fg-brand underline underline-offset-4" href={href}>{title}</a></dt><dd className="mt-2 text-body-sm text-fg-muted">{description}</dd></div>)}
      </dl>
    </Block>
  </Page>;
}
