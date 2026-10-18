---
name: select
title: Select
type: ui
surface: site
description: "Single-choice select with field, compact, ghost and chip treatments."
kinds: [input]
use_for: "Use the field appearance inside Field for forms. Use compact in dense rows and ghost or chip for filters. Field required is inherited by Select. Give Select a name for FormData; keep value and onValueChange on the root. Use compact on SelectContent for compact fields and toolbar menus."
never: [Rounded field triggers, Empty string item values, Long lists without a search (use a command)]
source: "https://agentcard.com/get-started (native field); Radix menu extends repository guide styles"
---

The field keeps the reference form's square border, 18px Inter and filled arrow. Its menu uses the same type size, fits the trigger and viewport, and wraps long option labels. Toolbar menus use `compact` for 14px display text.

For controlled forms, reset `value` from the form's `onReset` handler. `Field` displays your current error; validation and submitting to a backend belong to the form. A disabled item cannot be chosen. Prefer a segmented control when a small set of choices should remain visible.
