---
name: use-hold
title: useHold
type: hook
surface: site
description: Fires an action only after the pointer or the Enter or Space key is held for a set time, and cancels on release, leave or blur.
kinds: []
use_for: "Destructive actions that should not fire on a stray click (HoldButton and DropdownMenuHoldItem use it, at 2 seconds). Spread `handlers` on the element and drive the fill from `isHolding`."
never: [Hold for actions that can be undone]
---
