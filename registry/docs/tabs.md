---
name: tabs
title: Tabs
type: ui
surface: site
description: "The brand's tab track: a sunken track of equal 40px tabs in the 14px display face, with the blue key gliding to the selected one. `plain` drops the track for dense rows."
kinds: [tabs]
use_for: "Two to five sibling views: plans, FAQ topics, product details. `default` everywhere it can breathe (add w-full to match the content's width), `size=\"sm\"` in a tight card, `plain` for a filter row in a dense list, `glide={false}` when your triggers draw their own selected surface."
never: [Tabs for actions, Underlined tabs, Pill-shaped tabs, More than one blue key in a track]
source: "live https://www.agentcard.sh/pricing (.plan-tabs, .plan-tab, .plan-tabs-thumb); src/app/globals.css (.v7-guide-tablist for size sm)"
---
