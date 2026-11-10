# Agentcard design system

Components, design tokens and a CLI for building Agentcard pages and interfaces.

Reference: https://agentcard-ds.vercel.app

## Consistent CLI workflow

```sh
npx agentcard-ds info --json
npx agentcard-ds search button --json
npx agentcard-ds view button --json
npx agentcard-ds add button card --dry-run --json
npx agentcard-ds add button card --json
npx agentcard-ds add button --diff
```

For a new app: `npx -y github:anwarlemu/agentcard-brand-cli#release create --template vite --name my-app`.
For an existing app: `init` sets up the theme; `apply --dry-run` previews a requested restyle.
`add` also installs agent instructions and portable Claude/Codex skills, so a separate init is optional.
Use `--cwd <app>` for a different directory. Existing components.json aliases, TS/JS output, local helpers, unrelated registries and local component edits are preserved.

The standard registry works with shadcn 4.22.1:

```sh
npx agentcard-ds init
npx agentcard-ds shadcn add @agentcard-ds/theme @agentcard-ds/button
npx agentcard-ds mcp init --client claude
```

Include `theme` explicitly when using upstream shadcn to update existing theme aliases. Native `add` handles it automatically. Shared workspace installation, presets, migrations, registry authoring and MCP use the pinned upstream implementation via `shadcn <args...>`. Bundled component discovery works offline; installation needs network access for missing dependencies. Agent hosts must load their MCP configuration before it is available in a session.

## Install the CLI

Run once from the project root:

```sh
npm install --save-dev github:anwarlemu/agentcard-brand-cli#release
```

Prepare styles, fonts and agent instructions for new work:

```sh
npx agentcard-ds init
npx agentcard-ds guide
```

`init` does not convert existing components. The bare command does; see "Update an existing interface" below.
Requires Node.js 20 or later. Read [the agent guide](https://agentcard-ds.vercel.app/agents.md) with any coding agent.
The same guide is installed at `.ds/agent-guide.md`. Agents that do not auto-load project instructions should read it explicitly.

## Add components

Run `add` from the target app root. Components require React 19.2+, Tailwind CSS 4, and valid project configuration. For other frameworks, run the bare CLI command to apply the brand instead. In a React and Tailwind 4 app, add the components the page needs:

```sh
npx agentcard-ds add button card field input --surface product
```

The CLI copies component source, installs dependencies and adds the theme. It uses the project’s `src` folder and
configured aliases and components.json paths. Read each component’s examples and usage notes before changing it.

```sh
npx agentcard-ds add hero section site-header site-footer --surface site
npx agentcard-ds list --json
npx agentcard-ds show select --json
npx agentcard-ds tokens border
npx agentcard-ds image list --json
```

## Render an image

`image render` writes an Open Graph image (1200 by 630) or a social post (`square` 1080 by 1080, `portrait` 1080 by 1350, `landscape` 1200 by 675) from copy you pass in. Templates are `headline`, `subtext`, `screenshot`, `quote` and `announcement`. Output is PNG and SVG, with no browser. `image list --json` lists every field. `--json` prints the files and their pixel sizes. The default footer is the site host, and `--no-footer` leaves it off. Pictures use the brand tokens, the shipped logo and the shipped font files. `--template` is required. An unknown template, size or JSON field is an error, and so is a field the template does not list.

```sh
npx agentcard-ds image render --template quote --quote "A sentence someone said." --by "The source" --size og,square --out ./images --json
```

## Read the brand system

`manifest --json` is the catalog: every command, token group, font, logo rule, image template, video template, component and principle. `describe --json` is the same command. `brand --json` returns tokens, fonts, logos and voice. Groups are `color`, `type`, `space`, `radius`, `motion`, `shadow`, `band`, `glass` and `other`.

```sh
npx agentcard-ds manifest --json
npx agentcard-ds brand tokens --group color --json
npx agentcard-ds brand tokens --name=--ds-color-brand --json
npx agentcard-ds brand fonts --json
npx agentcard-ds brand logos --json
npx agentcard-ds brand voice --json
npx agentcard-ds principles --surface site --json
```

Use the equals form for `--name`. A bare `--ds-...` is parsed as a flag. `brand fonts --json` says which families ship and which token families have no file. Do not download a stand-in. `principles --surface product --json` reports whether a product system is defined. If it is not, do not invent one.

## Render a video

`video render` writes a short clip from the same tokens, logo files and shipped fonts. Sizes are `square` (1080 by 1080), `vertical` (1080 by 1920) and `landscape` (1920 by 1080). Templates are `social`, `announcement` and `product`. `--size` is required. The clip is 12 frames at 12 fps, Motion JPEG in an MP4, eased with `--ds-easing-out`. There is no browser and no duration flag. The same inputs write the same bytes. Samples are in `examples/videos/`.

```sh
npx agentcard-ds video list --json
npx agentcard-ds video render --template social --size square --headline "Let agents buy anything online" --out ./videos --json
```

## Use a component without guessing

`component list`, `component inspect` and `component emit` read the bundled library. `inspect` returns exports, variant maps, example states, usage and constraints. `emit --state` copies an example file. `emit --set` emits markup only for variant keys and values that exist.

```sh
npx agentcard-ds component inspect button --json
npx agentcard-ds component emit button --state Site --json
npx agentcard-ds component emit button --set variant=primary --set size=sm --text "Start free" --json
```

## Instructions for coding agents

Include this with the page requirements:

```text
Build this page using the Agentcard design system at https://agentcard-ds.vercel.app.
Read https://agentcard-ds.vercel.app/agents.md first.
Run npx agentcard-ds manifest --json first. It lists every command, token, template, size, component and rule.
Run npx agentcard-ds component inspect <name> --json before writing that component. Use component emit for markup. show --json still returns source.
Add existing components with the CLI. Use design tokens from brand tokens --json. Do not invent a token name.
Render Open Graph and social images with npx agentcard-ds image render. Render short videos with npx agentcard-ds video render. Run image list --json and video list --json for sizes and templates.
Read site rules with npx agentcard-ds principles --json. If product.defined is false, do not invent product principles.
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
| `init` | Install styles, fonts and agent instructions without converting existing components. |
| `guide` | Read the portable agent workflow, including setup and verification. |
| `show <item>` | Read usage rules, exports, examples and source. Use `--json` for structured output. |
| `add <items...>` | Copy components, dependencies and the theme into a React and Tailwind 4 project. |
| `list` | List available components, sections, page templates and visuals. |
| `look <file\|element>` | Show component and token guidance for a file or element type. |
| `tokens [term]` | Find a token by name or role. |
| `manifest` | List every command, token, template, size, component and rule. `describe` is the same command. |
| `brand` | Tokens, fonts, logos and voice. `brand tokens`, `brand fonts`, `brand logos` and `brand voice` read one part. |
| `principles` | Website do and don't lists, element rules, and whether product principles exist. |
| `component list` | List bundled components. |
| `component inspect <name>` | Exports, variants, states, usage and constraints. |
| `component emit <name>` | Copy an example state, or emit markup from the variant map. |
| `image list` | List image sizes, templates and the fields each template takes. |
| `image render` | Render an Open Graph or social image to PNG and SVG. `--template` is required. |
| `video list` | List video sizes, templates, the frame count and the renderer. |
| `video render` | Render a short Motion JPEG MP4. `--template` and `--size` are required. |
| `check [files...]` | Check style values. Use `--changed` for Git changes or `--fix` for exact token replacements. |
| `review <url> --any` | Review a page that is not part of an existing conversion task list. |
| `review <url>` | Review a tracked screen and mark its task complete when it passes. |
| `approve` | Approve a `ds-override` comment in a human-operated terminal. |
| `done <screen>` | Mark a native screen task complete. Web screen tasks use `review`. |
| `skip <screen> --reason "..."` | Record why a tracked screen was left unchanged. |

## Update an existing interface

The `apply` command restyles existing code, with color changes scoped to recognized components. It can replace matching React
components, convert style values, install styles and fonts, and add agent rules and checks. Review the diff before
continuing. This conversion preserves existing copy and behavior.

```sh
npx agentcard-ds apply --dry-run
npx agentcard-ds apply
```

Subsequent runs report the next screen to review. `--redo` repeats conversion after an update. Component decisions
are recorded in `.ds/components.json`. The conversion also installs checks for Claude Code, Codex, Cursor and Git
commits. Adding individual components with `add` does not run this conversion.

## Text and structured references

- `/agents.md`: the agent workflow.
- `/llms.txt`: short catalog with links to every component.
- `/llms-full.txt`: complete guide, examples and source.
- `/r/index.json`: all items, including hooks, helpers and theme.
- `/r/<name>.md` and `/r/<name>.json`: usage rules, exports, dependencies, examples and exact source.

All references are generated from the same registry the CLI installs. Prefer individual component references to
the complete file. `manifest`, `describe`, `guide`, `brand`, `principles`, `component`, `list`, `show`, `look`, `tokens`, `image list`, `video list` and `check` without `--fix` are read-only. `init` and
`add` accept `--dry-run`; `image render` and `video render` do too. Add `--json` for structured results. JSON goes to stdout; progress goes to stderr. Start with `manifest --json`.

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

The explicit `apply` command scopes color conversion to recognized components and preserves unrelated artwork and shared palette data. The legacy bare-command conversion remains for compatibility; use `apply` for new restyling tasks.
