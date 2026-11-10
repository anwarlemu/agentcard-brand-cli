---
name: {{bin}}
description: Build or restyle interfaces with the {{brand}} design system. Use when the project uses {{bin}} or the user requests {{brand}} components, tokens, or visual styling.
---

Use the project's configured components and brand tokens. Preserve the user's requested content and behavior.

Read project context with `npx {{bin}} info --json`. It reports the framework, stylesheet, aliases, installed components and registry. If the CLI is missing, use `npx -y {{source}}` in its place.

Find suitable components with `search <term> --json`, then read `view <names...> --json`. The response contains exact source and working examples. Inspect variant names, callback signatures and example dependencies instead of assuming another library's API.

Install with `add <names...> --dry-run --json`, then `add <names...> --json`. Existing local files are preserved. Use `add <names...> --diff` to compare updates; use `--overwrite` only when replacing those local changes is intended.

For new applications, `create --template vite --name <directory>` scaffolds the framework and installs the brand. Existing applications use `init`. Use `apply --dry-run` only when the user requests conversion of existing styles; package installation and restyling are different operations.

Read `guide` for brand rules and `tokens <term> --json` for custom styling. Keep colors scoped to component roles; preserve artwork, chart data and unrelated palettes. Use `check --json` and the application's build and interaction tests to verify the result.

Read the whole system with `manifest --json` before choosing a token, template, component or rule. `describe --json` is the same command. `brand --json` is tokens, fonts, logos and voice. `brand tokens --name=--ds-color-brand --json` looks up one token and errors if the name is missing. `principles --json` is the website do and don't list. If `product.defined` is false, do not invent product rules.

`component list --json`, `component inspect <name> --json` and `component emit <name> --json` read the bundled library. `--state` copies an example file. `--set key=value` emits markup only for variant keys that exist. Unknown keys and values error.

Render images with `image list --json`, then `image render --template <id> --json`. Sizes are `og` (1200 by 630), `square` (1080 by 1080), `portrait` (1080 by 1350) and `landscape` (1200 by 675). Templates are `headline`, `subtext`, `screenshot`, `quote` and `announcement`. `--template` is required. The command uses brand tokens, the shipped logo and the shipped font files. It writes PNG and SVG with no browser. Pass `--input <file>` for a JSON object of the same fields. Unknown JSON fields error. `--no-footer` leaves off the site line.

Render short videos with `video list --json`, then `video render --template <id> --size <id> --json`. Templates are `social`, `announcement` and `product`. Sizes are `square` (1080 by 1080), `vertical` (1080 by 1920) and `landscape` (1920 by 1080). `--size` is required. The clip is 12 frames at 12 fps, Motion JPEG in an MP4, eased with the brand easing token. The same inputs write the same bytes. A field the template does not list is an error.

The standard shadcn registry is `{{registry}}/r/shadcn/{name}.json`, under `@{{bin}}` in components.json. Use `npx shadcn@4.22.1 add @{{bin}}/theme @{{bin}}/<name>` for shadcn's workspace routing and ecosystem integrations. The same registry works with its MCP server. Component references are at `{{registry}}/components`.

With the upstream installer, include the theme explicitly so existing shadcn font and color aliases are updated. Native add applies it automatically.
