# agentcard-ds

Agentcard's design system as a library and a CLI: the components, sections and visuals of Agentcard's site
(agentcard.sh) for React and Tailwind, browsable at https://agentcard-ds.vercel.app, and one command that applies them
to any site and keeps coding agents on the brand.

It works on any site, in any stack or language: plain HTML and CSS, Astro, Next, Vue, Svelte, Tailwind, CSS-in-JS,
server templates, SwiftUI, Compose, Flutter and more. Agentcard has a site only, so an app or dashboard gets the same
look. It changes how things look and never what they say: every word, element and screen's purpose stays as it is.

## Use it

Give your coding agent (Claude Code, Codex, Cursor, Hermes or any other) this prompt:

```text
Apply the Agentcard design system to this project: run
`npx -y github:anwarlemu/agentcard-brand-cli#release` and do what it says until it says you are done.
Change how things look, never what they say.
```

That is all. It first identifies the app's components: what each one is, from its name, what it renders, its props
and how it is used. In a React + Tailwind app, a component the library covers either renders the library's (its props
mapped, its name and every use unchanged), or, where that would lose something, takes the library item's look on the
element it renders; in any stack, stylesheet classes it recognizes get that element's brand styling. Anything nothing
covers keeps its own design with brand values. The app is type-checked before and after, and a swap that would break
it goes back. Every decision and its reason is in `.ds/components.json`. The first run also adds the package to the
project, converts every style value to the brand (colors by the role they play, type, spacing, radius, shadows,
motion), installs the brand stylesheet and fonts, marks the home hero for the blue ground, and writes short rules and
hooks for the agents. Then each run prints one task: one screen, with the elements to restyle and how. A task is done
when the screen passes `review` (screenshots at desktop and phone width, scored against the brand's own pages) and
every value in its files is a brand token. When every main screen is done it says so.

From then on the hooks (Claude Code, Codex, Cursor) and a git pre-commit check block any write that adds an off-brand
value, so new work stays on the brand.

## The library

Every component, section and visual from Agentcard's site, for React and Tailwind 4. Components are copied into your
project as source you own (nothing to import from a package): the raised keys, windows, tabs, fields and overlays, the
header, glass dock, hero, sections, pricing, FAQ and footer, and the visuals (the stepped bands, the striped wordmark,
the merchant line). Each has a live preview, its code and its install command on the site.

```sh
npx agentcard-ds add button window tabs      # copies them in, with what they need and the theme
```

## Commands

| Command | Does |
|---|---|
| `npx agentcard-ds` | First run: install and convert. Every run after: the next task. `--redo`, `--dry-run`. |
| `npx agentcard-ds add <items...>` | Copies library components into a React + Tailwind project, with the items they need, the theme and their packages. |
| `npx agentcard-ds list` | Every component, section and visual in the library. |
| `npx agentcard-ds review <url>` | Screenshots at desktop and phone width, scored against the brand; checks off the screen's task at 7 or more. |
| `npx agentcard-ds look <file\|element>` | The brand styling (CSS, Tailwind, states) for every element in a file, or one element kind. |
| `npx agentcard-ds check [files]` | Every style value must be a brand token. `--fix` for exact matches, `--changed` for git changes. |
| `npx agentcard-ds tokens [term]` | Find a token. |
| `npx agentcard-ds approve` | A person approves `ds-override` comments in a terminal. Agents cannot. |
| `npx agentcard-ds done <screen>` | Marks a native screen restyled (web screens are checked by `review`). |
| `npx agentcard-ds skip <screen> --reason "..."` | Leaves a screen as it is when it cannot pass without changing words or elements; the final summary lists each skip and why. |

`review` runs on the agent's own subscription: through Codex (`codex exec`) or Claude Code (`claude -p`), whichever is
running, or the Anthropic API when a key is set. In any other agent (Cursor, Hermes and the rest) it saves the
screenshots and the agent scores them itself; the final summary says which screens were scored that way. It needs
`playwright-core` with Chromium (`npx playwright install chromium`).

## What it brings

White sections on a warm paper page and the electric blue (#0000FF) as a ground: the hero, a panel, the footer, with
four stepped bands wherever blue meets white. Ink type: headings, labels and buttons in Neue Haas Grotesk Display
(Helvetica Neue where it is not installed) at 500, tracked tight, body text in Inter. Every button and tab a raised key
with an 8px bevel that sinks on press: blue on white, white on blue. White cards with a hairline and 12px corners,
window bars in sky with blue marks, square fields, a blue footer.

Everything brand-specific lives in `brand/`: `tokens.css` (every value), `site.css` (the base layer), `elements.json`
(how each kind of element is styled, with its source), `reference/` (screenshots of the brand's own pages, used by
`review`), `logo/`, `principles.md`, `rubric.md`, `contract.md` and `brand.json` (names, fonts, the home touch and
the library's variant names).
