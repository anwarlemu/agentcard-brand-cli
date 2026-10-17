---
name: team-directory
title: Team directory
type: site
surface: site
description: "The About page's team and investors: a window holding a ruled grid of people (a gray photo, the name in the display face, the role in small muted type) with a blue arrow on each linked cell, two to a row for the team in the blue-bar window and three for investors in the sky one, the backers as the last row."
kinds: [window, window-bar, card, link]
use_for: "A team, advisors, investors or partners on an About or company page. The team's window gets `tone=\"blue\"` (one per page); the rest stay sky."
never: [Color photos, Round avatars, Bold names, More than one blue-bar window per page, Cards with gaps between people instead of the ruled grid]
source: "agentcard-website src/components/v7/company-page.tsx; src/app/globals.css:1808 (.v7-about); agentcard.sh/about (computed: .v7-about-sec, .v7-about-cell)"
---

`TeamDirectory` props: `name` (the bar label: `team.dir`), `tone` (`blue` | `sky`, default sky), `columns` (1 | 2 | 3,
default 2; one column on phones; two columns use 64px photos and 96px cells, three use 40px photos and 84px cells),
`people` (`{ name, role?, photo?, photoAlt?, href? }`: `photo` is an image URL or any node, shown in grayscale; `href`
makes the cell a link with the arrow), `footer` (`{ logo?, label?, href?, ariaLabel? }[]`, two to a row).

A linked cell lights sky under the pointer and its arrow nudges up and right (160ms, ease-out); nothing else moves.
