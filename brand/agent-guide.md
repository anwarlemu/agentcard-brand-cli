# {{brand}} design system: instructions for agents

Use this system to build {{brand}} pages and interfaces from the user's brief. These instructions work with any agent that can read text and edit project files. The CLI is a local Node.js tool; no model account or agent-specific integration is needed for setup, discovery, installation or token checks.

## Start here

1. Read the project instructions and package.json. Identify the framework, package manager, stylesheet and import aliases. Use the user's requirements to decide whether to build new UI or restyle existing UI.
2. Read this guide, then the relevant component references. The library is at {{registry}}/components. Plain text is at {{registry}}/llms.txt; a complete copy is at {{registry}}/llms-full.txt.
3. Reuse the library's components and variants. Do not recreate them from screenshots or guess their props. Each reference contains the actual exports, dependencies, working examples and source code.

## Install and prepare a project

Requires Node.js 20 or later. Run commands from the consuming project root, not the design-system repository.

```sh
npm install --save-dev {{source}}
{{cli}} init
```

`npm install` installs the CLI only. `init` installs styles, fonts and agent instructions without converting existing components or creating conversion review tasks. It preserves other instructions already in the project. Inspect its warnings about a missing stylesheet or alias.

React components require React 19 or later, Tailwind CSS 4 and a working build. The installer follows components.json and TypeScript or JavaScript aliases; without aliases, it uses relative imports. Set up that framework first. Other frameworks can use the CSS tokens and styling guidance, but cannot render the React components.

For an existing interface that the user wants restyled, preview the explicit apply command:

```sh
npx -y {{source}} apply --dry-run
npx -y {{source}} apply
```

The apply command can adapt matching components, convert style values, and install agent rules and hooks. Color conversion is scoped to recognized components; unrelated palettes and artwork remain unchanged. The legacy bare command also converts styles; use explicit commands for setup and discovery. Subsequent runs resume review tasks. `--redo` repeats conversion. Review the diff and test existing behavior after conversion; a successful exit is not proof that the visual review is complete.

## Find, inspect and add components

```sh
{{cli}} list --json
{{cli}} show select
{{cli}} show select --json
{{cli}} add field select button --dry-run --json
{{cli}} add field select button --json
```

The add command above is an example, not the list required for every page. Choose items from `list`. `show` is read-only and works offline using the registry bundled with the CLI. `show --json` returns source, examples, usage rules, exports, dependencies and links. Hooks and helper libraries are included in the JSON index.

`add` copies source files and their transitive dependencies, installs missing npm packages, and wires the theme. Existing files are kept. Use `--overwrite` only when intentionally replacing local component changes. Read the returned file list and warnings. Generated imports and target files follow components.json and the project alias configuration. Existing utility files are preserved; brand helpers use their own names.

For HTTP-only agents, fetch `{{registry}}/r/index.json`, then `{{registry}}/r/<name>.json` or `{{registry}}/r/<name>.md`. Follow `requires` recursively. Each `files[].path` is relative to the source root; `files[].content` is the exact source. Each example lists its own `requires` and `packages`; install these too when using that example. Do not copy the example file as the component implementation. The CLI handles dependency ordering and theme installation for you.

The component reference states its source. `{{registry}}/r/audit.json` records the reference basis for all components. Some controls extend shared Agentcard patterns because the public site has no standalone equivalent. Select uses the site’s field styling with a portable Radix menu; the reference site’s menu is native to the browser. Do not describe extensions as exact copies of live controls.

## Compose the interface

- Follow the user's brief. For new pages, add the required content and behavior. When only restyling an existing page, preserve its content, links, order and behavior unless the user requests changes.
- Use component props and variants shown in the source. Read the named example functions before composing compound components. Keep client state inside a client component when using Next.js; imports of client components can still be rendered by server pages.
- Use design tokens for custom styles. `{{cli}} tokens <term> --json` finds values; `{{cli}} look <element-or-file> --json` explains styling by role. Use `var(--ds-*)` in CSS or the matching Tailwind utilities.
- Body text uses Inter; headings, labels and buttons use the display font stack. Use the provided blue and white/paper grounds, button bevels, windows and stepped band divider. Do not introduce unrelated colors, shadows or type scales.
- The installed stylesheet imports `./_{{bin}}/brand.css` and `./_{{bin}}/theme.css` beside the main stylesheet. `brand.css` includes tokens and base styles. Keep both imports after `@import "tailwindcss"`. Let the installer configure fonts; do not add a second font loader.
- Put one control in each Field. Field connects labels, help, errors and required state. Validation and submission belong to your form. For Select use `value` and `onValueChange`, SelectTrigger with SelectValue, and SelectContent with SelectItem; values must be non-empty strings. Give the root a `name` for FormData. Use `defaultValue` only for uncontrolled input.
- Connect every action to its intended behavior. Handle empty, loading, disabled, invalid, success and error states. Preserve keyboard controls, focus return, accessible names and native form semantics. Never present a preview's local demo action as a completed backend operation.
- Use the provided portal behavior. Surface is for an isolated preview or a scoped theme; ordinary pages do not need an extra Surface wrapper. Mount one Toaster per application when using toast notifications.

## Verify before finishing

1. Run the consuming project's type checks, tests and production build.
2. Run `{{cli}} check --json`. Exit 0 means no token violations; exit 1 means unresolved violations or a command error. Read the JSON result, fix the findings and rerun. A token check does not test accessibility or behavior.
3. Test every interaction with mouse and keyboard. Submit invalid and valid forms, choose options, open and close overlays, and test loading/error paths. Check desktop and phone widths, focus visibility, overflow and reduced-motion behavior.
4. Compare screenshots against the relevant library previews and reference. `{{cli}} review http://localhost:3000 --any` can capture and review a running page. It requires playwright-core and Chromium. Automated scoring uses an available supported reviewer; if none is available, read the saved screenshots and report a manual review. Never claim an independent score that was not produced.
5. Report what changed, which checks passed, and any remaining limitations. If conversion left follow-up tasks, complete or report them explicitly.

## Instructions and hooks

`init` and conversion install AGENTS.md and a local `.ds/agent-guide.md`, plus supported agent instruction files and hook configuration. Agents that do not load those files automatically should read them explicitly. Hooks support Claude Code, Codex and Cursor when enabled by that tool; other agents run the CLI checks directly. Codex hook activation may require the user's `/hooks` trust step. No hook integration is required to use the components correctly.

Read-only commands: `guide`, `list`, `show`, `look`, `tokens`, `check` without `--fix`.
Commands that write project files: `init`, `add`, `apply`, the legacy bare conversion command, `check --fix`, and review/snapshot state updates. Use `--dry-run` with `init`, `add` or conversion to inspect planned writes. JSON goes to stdout and progress goes to stderr. Installation/build failures return a nonzero exit code.

## Project configuration and agent handoff

Start with `{{cli}} info --json`, then `search <term> --json` and `view <names...> --json`. These commands are read-only. `show` and `inspect` remain aliases of `view`.

`add` respects components.json, inherited TypeScript or JavaScript aliases, the target stylesheet and the package manager. It emits JSX/JS when `tsx` is false, installs the theme and agent guidance, and preserves differing local files. Use `add <names...> --diff` to review changes before `--overwrite`. Use `--cwd <app>` from a repository root. For shared workspace packages, use the upstream installer described below.

`create --template vite --name <directory>` scaffolds a new app and installs brand components. `init` configures an existing app; `init button card` also adds components. `apply --dry-run --json` previews a requested conversion of existing styles. Do not run conversion to discover or install the library.

Portable skills are installed in `.agents/skills/{{bin}}/SKILL.md` and `.claude/skills/{{bin}}/SKILL.md`; the full guide is `.ds/agent-guide.md`. Read `add --view` or the installed source for imports resolved to this project's paths. The installed brand utility is separate from the application's existing `lib/utils` exports.

The standard shadcn registry is configured under `@{{bin}}` in components.json. For workspace routing, install with `{{cli}} shadcn add @{{bin}}/theme @{{bin}}/button`. Include the theme explicitly with upstream shadcn so existing font and color aliases are updated. Native `add` applies it automatically.

Advanced operations use pinned shadcn 4.22.1: `shadcn <args...>`, `mcp`, `registry`, `preset`, `migrate`, `eject`, and `build`. These need network access on first use and preserve upstream output formats. Native brand commands accept `--json`. Preset/base changes are upstream operations that may change the brand; use them only when requested. MCP configuration alone does not prove the agent host has loaded its server.

The explicit `apply` command scopes color conversion to recognized components and preserves unrelated artwork and shared palette data. The legacy bare-command conversion remains for compatibility; use `apply` for new restyling tasks.
