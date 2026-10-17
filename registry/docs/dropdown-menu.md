---
name: dropdown-menu
title: Dropdown menu
type: ui
surface: site
description: "A menu on the brand's floating panel (white, a hairline, 8px corners) with rows in the 14px display face, or the dock's `glass` menu; it grows from its trigger."
kinds: [menu-panel, menu-item, glass-menu, glass-menu-item]
use_for: "A short list of actions on one thing (a card's actions), or the products under a nav item (`variant=\"glass\"` on DropdownMenuContent over the blue ground or a photo). A row that closes or deletes uses DropdownMenuHoldItem."
never: [Menus for navigation that should be visible, More than one level of submenu, A destructive row that fires on one click]
source: "agentcard-website src/app/globals.css (.v7-dock-card); live https://www.agentcard.sh/"
---
