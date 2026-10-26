---
name: trace
title: Trace
type: ui
surface: site
description: "An agent's steps as quiet display-face lines with a glyph, a running step in ink with a spinner, a failed one in red, and steps that open to show their detail."
use_for: "Use to show what an agent did or is doing during a purchase: one TraceLine per step with a TraceIcon, a TraceTitle and an optional TraceDescription (a duration or a count). Set status running (use Spinner as its glyph), pending or error. Wrap a step in TraceCollapsible with TraceCollapsibleTrigger and TraceCollapsibleContent when it has detail; wrap a line in a link or button to make it act."
never: [Bold step titles, More than one running step, Steps that animate in one by one, Colors other than ink, red and the muted ink]
source: "Extrapolated from Agentcard: the updates page's display-face lines (agentcard.sh/updates), the FAQ's disclosure and the Collapse"
---
