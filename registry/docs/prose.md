---
name: prose
title: Prose
type: site
surface: site
description: "Long-form text as the legal pages set it: the 680px reading column, an optional head (blue eyebrow, 52px title, small caps date line over a rule), then semantic HTML styled in place: 16px Inter at 28px and 82 percent ink, display-face headings, blue underlined links, lists, 14px ruled tables and code."
kinds: [page, column, eyebrow, hero-title, body-text, link, table, code-window]
use_for: "Terms, privacy, card terms, guides, docs pages, a changelog's column (`wide`). Feed it markdown output or plain HTML elements."
never: [Bold headings or table headers, Body text wider than 680px, Links without the underline, Centered long text]
source: "agentcard-website src/app/globals.css:1808 (.v7-about-sheet), 2199 (.v7-guide-prose); agentcard.sh/terms and /card-terms (computed: .v7-about-head, .v7-prose)"
---

`Prose` props: `eyebrow`, `title`, `meta` (the head; any of them renders it), `wide` (820px instead of 680px),
`bodyClassName`, and children (the HTML to style). It styles `p`, `h2` (24px), `h3` (16px), `h4`, `ul`, `ol`, `a`,
`strong`, `table` with `th` and `td`, inline `code`, `pre`, `blockquote`, `hr`, `img` and `figcaption`.

The brand's tables set headers and `strong` in 700 and its h3 in 600; here they are medium (500), as the brand's rules
say nothing is bold.
