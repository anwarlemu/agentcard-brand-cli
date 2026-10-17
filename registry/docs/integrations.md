---
name: integrations
title: Integrations
type: site
surface: site
description: "One raised card on paper per kind of integration: a 36px title, a 19px line at 70 percent and a list of raised rows, one per tool, beside a blue stage that shows the chosen tool. The picked row is pressed in (blue edge, pale blue fill); the stage crossfades. Rows alternate sides; the copy sits above the stage below 1024px."
kinds: [card-raised, media-frame, code-window, tabs]
use_for: "Showing how the product plugs into other tools. Pass `rows` (title, description, options of label, icon, panel). Build panels from `IntegrationCode` (a code window) and `IntegrationScreen` (a glass panel laid over its corner)."
never: [More than six tools in one row, Autoplaying the rows, Panels on a white ground, Light code windows]
source: "agentcard-website src/components/v7/integrations.tsx; agentcard.sh / (.v7-intg-row, .v7-intg-tab, .v7-intg-stage, computed)"
---
