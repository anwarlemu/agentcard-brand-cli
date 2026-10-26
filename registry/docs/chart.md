---
name: chart
title: Chart
type: ui
surface: site
description: "Bar, line, area and donut charts in SVG, in the brand's four series colors, with the guides' white tooltip and a display-face legend."
use_for: "Use to show spend or activity over time (BarChart, LineChart, AreaChart) or a share of a whole (PieChart). Wrap the chart in ChartContainer with a config that names each series (colors default to series-1 to series-4), then add ChartTooltip and ChartLegend. Give every chart an aria-label. Legend items toggle their series; arrow keys move the tooltip."
never: [More than four series, 3D or gradient-heavy charts, Charts that animate again on every update, Colors outside the series tokens]
source: "Extrapolated from Agentcard: the series tokens, the tooltip (agentcard-website .v7-tooltip) and the display face's small print"
---
