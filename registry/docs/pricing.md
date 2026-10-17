---
name: pricing
title: Pricing
type: site
surface: site
description: "The pricing page: a 52px title, product tabs on the sunken track with the gliding blue key, and the chosen product's plans as windows, two across, over a hard 6px offset shadow. A plan shows its name at 24px, who it is for, the figure at 36px with its unit, dotted rules around the features (blue check, title in ink, detail muted) and the full-width blue key. Plans side by side line up row by row."
kinds: [window, window-bar, stat, tabs, button-primary]
use_for: "Plans grouped by product. Pass `title` and `products` (label, plans of name, line, price, unit, includes, features of title and detail, action, featured, file). One featured plan per product gets the blue bar; one product hides the tabs; a product with one plan centres it."
never: [More than one featured plan per product, Repeating the free plan's features in the paid plan (use includes), Strikethrough prices without a reason, A pill or secondary key for the plan's action]
source: "agentcard-website src/components/v7/pricing-plans.tsx; agentcard.sh /pricing (.plan-tabs, .v7-offer-card, .v7-offer-list, computed)"
---
