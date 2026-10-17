---
name: pricing
title: Pricing
type: site
surface: site
description: "Pricing plans grouped by product, with optional tabs."
kinds: [window, window-bar, stat, tabs, button-primary]
use_for: "Pass title and products with their plans, prices, features and actions. Use one featured plan per product. A single product hides the tabs."
never: [More than one featured plan per product, Repeating the free plan's features in the paid plan (use includes), Strikethrough prices without a reason, A pill or secondary key for the plan's action]
source: "agentcard-website src/components/v7/pricing-plans.tsx; agentcard.sh /pricing (.plan-tabs, .v7-offer-card, .v7-offer-list, computed)"
---
