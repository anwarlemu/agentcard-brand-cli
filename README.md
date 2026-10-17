# Agentcard design system

Components, design tokens and a CLI for building Agentcard pages and interfaces.

Reference: https://agentcard-ds.vercel.app

## Install the CLI

Run once from the project root:

```sh
npm install --save-dev github:anwarlemu/agentcard-brand-cli#release
```

Then use `npx agentcard-ds` with the commands below.

## Add components

In a React and Tailwind 4 project, add the components the page needs. For example:

```sh
npx agentcard-ds add button card field input
```

The CLI copies component source, installs dependencies and adds the theme. It uses the project’s `src` folder and
`@` alias when configured. Read each component’s examples and usage notes before changing it.

```sh
npx agentcard-ds add hero section site-header site-footer
npx agentcard-ds list
npx agentcard-ds tokens border
```

## Instructions for coding agents

Include this with the page requirements:

```text
Build this page using the Agentcard design system at https://agentcard-ds.vercel.app.
Read the relevant component examples and usage notes before writing code.
Add existing components with the CLI. Use design tokens for custom layout and styling.
Connect every control to its intended behavior. Include validation, loading, empty and error states where needed.
Run the project checks and the CLI token check. Test keyboard interaction and desktop and phone layouts.
```

## Check the implementation

```sh
npx agentcard-ds check --changed
npx agentcard-ds review http://localhost:3000 --any
```

Start the development server before running `review`. It captures desktop and phone screenshots and compares the
page with the Agentcard reference. It requires `playwright-core` and Chromium (`npx playwright install chromium`).
Review uses the available Codex or Claude Code session, or the Anthropic API when configured. When no reviewer is
available, it saves screenshots for the coding agent to review. Visual review does not test form validation or
control behavior; test those separately.

## Commands

Run these commands with `npx agentcard-ds` after installing the CLI.

| Command | Purpose |
|---|---|
| `add <items...>` | Copy components, dependencies and the theme into a React and Tailwind 4 project. |
| `list` | List available components, sections, page templates and visuals. |
| `look <file\|element>` | Show component and token guidance for a file or element type. |
| `tokens [term]` | Find a token by name or role. |
| `check [files...]` | Check style values. Use `--changed` for Git changes or `--fix` for exact token replacements. |
| `review <url> --any` | Review a page that is not part of an existing conversion task list. |
| `review <url>` | Review a tracked screen and mark its task complete when it passes. |
| `approve` | Approve a `ds-override` comment in a human-operated terminal. |
| `done <screen>` | Mark a native screen task complete. Web screen tasks use `review`. |
| `skip <screen> --reason "..."` | Record why a tracked screen was left unchanged. |

## Update an existing interface

Running the CLI without a subcommand applies the design system to existing code. It can replace matching React
components, convert style values, install styles and fonts, and add agent rules and checks. Review the diff before
continuing. This conversion preserves existing copy and behavior.

```sh
npx agentcard-ds --dry-run
npx agentcard-ds
```

Subsequent runs report the next screen to review. `--redo` repeats conversion after an update. Component decisions
are recorded in `.ds/components.json`. The conversion also installs checks for Claude Code, Codex, Cursor and Git
commits. Adding individual components with `add` does not run this conversion.

## Source

- `registry/components/`: components and page templates.
- `registry/examples/`: working examples shown in the docs.
- `registry/docs/`: component descriptions, usage notes and constraints.
- `brand/tokens.css`: design tokens.
- `brand/elements.json`: styles for each element type and their source references.
- `brand/reference/`: reference screenshots used for review.
- `apps/www/`: the design system site.

Run `npm run ci` for the CLI tests and registry checks, `npm run build --workspace www` for the docs build,
and `DOCS_URL=http://localhost:3000 npm run test:docs` for the browser checks against a running production build.
