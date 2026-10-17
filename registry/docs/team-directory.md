---
name: team-directory
title: Team directory
type: site
surface: site
description: "Responsive directory of people with photos, roles and optional links."
kinds: [window, window-bar, card, link]
use_for: "Use for teams, advisors, investors or partners. Use tone=\"blue\" for the primary directory and the default tone for others. Provide current names and links."
never: [Color photos, Round avatars, Bold names, More than one blue-bar window per page, Cards with gaps between people instead of the ruled grid]
source: "agentcard-website src/components/v7/company-page.tsx; src/app/globals.css:1808 (.v7-about); agentcard.sh/about (computed: .v7-about-sec, .v7-about-cell)"
---

`TeamDirectory` props: `name` (the bar label: `team.dir`), `tone` (`blue` | `sky`, default sky), `columns` (1 | 2 | 3,
default 2; one column on phones; two columns use 64px photos and 96px cells, three use 40px photos and 84px cells),
`people` (`{ name, role?, photo?, photoAlt?, href? }`: `photo` is an image URL or any node, shown in grayscale; `href`
makes the cell a link with the arrow), `footer` (`{ logo?, label?, href?, ariaLabel? }[]`, two to a row).

A linked cell lights sky under the pointer and its arrow nudges up and right (160ms, ease-out); nothing else moves.
