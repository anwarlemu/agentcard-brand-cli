---
name: faq
title: FAQ
type: site
surface: site
description: "The FAQ in one large window (sky bar, faq.help): a 52px title, a one-line lead, topic tabs on the sunken track with the blue key gliding between them, and the questions on light rules with a drawn + that turns to an x as the answer slides open. Topics share one cell, so the window keeps its height."
kinds: [faq, tabs, window, window-bar]
use_for: "The FAQ of a home or product page. Pass `title`, `lead` and `topics` (label, items of question and answer); one topic hides the tabs. `bar` names the window."
never: [More than four topics, Answers longer than a short paragraph, Questions in caps, A chevron in place of the drawn +]
source: "agentcard-website src/components/faq.tsx, src/app/globals.css:932 (.faq2, .faq-list); agentcard.sh / (.faq-card, .faq-tabs, .faq-list, computed)"
---
