---
name: prose
title: Prose
type: site
surface: site
description: "Typography and layout for long-form content."
kinds: [page, column, eyebrow, hero-title, body-text, link, table, code-window]
use_for: "Use for documentation, guides, legal content and release notes. Pass semantic HTML or rendered Markdown. Use wide for a wider content column."
never: [Bold headings or table headers, Body text wider than 680px, Links without the underline, Centered long text]
source: "agentcard-website src/app/globals.css:1808 (.v7-about-sheet), 2199 (.v7-guide-prose); agentcard.sh/terms and /card-terms (computed: .v7-about-head, .v7-prose)"
---

`Prose` props: `eyebrow`, `title`, `meta` (the head; any of them renders it), `wide` (820px instead of 680px),
`bodyClassName`, and children (the HTML to style). It styles `p`, `h2` (24px), `h3` (16px), `h4`, `ul`, `ol`, `a`,
`strong`, `table` with `th` and `td`, inline `code`, `pre`, `blockquote`, `hr`, `img` and `figcaption`.

The brand's tables set headers and `strong` in 700 and its h3 in 600; here they are medium (500), as the brand's rules
say nothing is bold.
