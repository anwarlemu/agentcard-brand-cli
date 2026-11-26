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

## Make images, clips, slides, illustrations and merch

Every asset is drawn from the brand's own layouts and tokens, with no browser, and the same input writes the same bytes.

- `image <template>`: share images, social posts, banners and profile pictures (`image render --template` is the same). Templates `hero`, `window` and `cards` (the brand's image editor layouts, with its toon objects) plus `headline`, `subtext`, `screenshot`, `quote`, `announcement` and `logo`. The shared platform sizes (`og`, `square`, `portrait`, `story`, `landscape`, `x-banner`, `linkedin`, `linkedin-banner`, `linkedin-page`, `youtube`, `youtube-thumbnail`, `email`, `avatar`, `custom`), each clear of what its platform covers. PNG, SVG, JPG and WebP. Only the copy you pass is drawn; words that do not fit fail with what to shorten. `image carousel` makes a numbered set.
- `design`: make a graphic and revise it until it is right, on a small JSON file: `design new`, `revise "bigger headline, logo top right"`, `edit`, `undo`, `variants`, `sizes`, `compare`, `check`. Every write is checked against the brand; errors change nothing.
- `video <template>`: clips of every image layout that move the way the brand does (ease-out entrances, the site's sticker drift, the band's grain), MP4 and WebM through ffmpeg (Motion JPEG MP4 without it), 2 to 12 seconds, `--still` for one frame.
- `deck`: slides at 1920x1080 from a JSON file (cover, section, statement, bullets, stat, quote, image, cards, end): a PNG per slide and one PDF.
- `illustrate`: toon object illustrations from the brand's fifteen objects or any picture. Rules in `brand/illustration.md`.
- `merch`: print files at real size with bleed and safe area (tee, hoodie, cap, tote, mug wrap, stickers with cut lines, poster): SVG in inches, PNG at 300 dpi and a proof. Sizes are vendor conventions.
- `figma tokens|push|pull|check`: variables, Figma-ready files and value checks; the CLI prints the Figma MCP calls and never calls Figma itself.

```sh
npx agentcard-ds image hero --headline "Let agents buy anything online" --size all --json
npx agentcard-ds design new hero --size x-banner --headline "Let agents buy anything online" -o banner.design.json
npx agentcard-ds design revise banner.design.json "bigger headline, logo top right, darker theme"
npx agentcard-ds video hero --headline "Let agents buy anything online" --size square --format mp4,webm --json
npx agentcard-ds deck --input deck.json --out deck --json
npx agentcard-ds illustrate cart coins --ground paper --json
npx agentcard-ds merch tee-front --variant all --json
npx agentcard-ds figma tokens --out figma --json
```

The docs site shows a gallery of each (Assets, Designs, Illustrations and Figma pages); `npm run gallery` regenerates it.

## Read the brand system

`manifest --json` is the catalog: every command and flag, token group, font, logo rule, image template and size, video template, slide type, merch item, illustration subject, Figma action, component and principle. `describe --json` is the same command. `brand --json` returns tokens, fonts, logos and voice. Groups are `color`, `type`, `space`, `radius`, `motion`, `shadow`, `band`, `glass` and `other`.

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
Render images with npx agentcard-ds image <template>, revise them with design, clips with video, slides with deck, illustrations with illustrate, merch with merch and Figma files with figma. Run manifest --json for every template, size and subject.
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
| `image <template>` | Render a share image, post, banner or profile picture (`image render --template` is the same). |
| `design` | Make a design file, revise it in plain words or exact edits, undo, check. |
| `video list` | List video sizes, templates, the motion and the renderer. |
| `video <template>` | Render an MP4 or WebM clip of any image layout (ffmpeg), or one frame with `--still` (`video render --template` is the same). |
| `deck` | Render slides from a JSON file to a PNG per slide and one PDF. `--list` names the slide types. |
| `illustrate [subjects...]` | Draw toon object illustrations, or a toon from `--image`, to SVG and PNG. |
| `merch [items...]` | Write merch print files at real size with bleed, safe area, proof and cut lines. |
| `figma <action>` | `tokens`, `push`, `pull`, `check`: Figma-ready files and the Figma MCP steps. |
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
`add` accept `--dry-run`; `image`, `video` and `design new|revise|edit` do too. Add `--json` for structured results. JSON goes to stdout; progress goes to stderr. Start with `manifest --json`.

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
