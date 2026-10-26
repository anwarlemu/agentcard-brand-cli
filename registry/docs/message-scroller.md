---
name: message-scroller
title: Message Scroller
type: ui
surface: site
description: "A conversation's scroll area that opens at the newest message, stays pinned while messages arrive, and shows the white Jump to latest key when the reader scrolls up."
use_for: "Wrap a conversation in MessageScroller with MessageScrollerViewport, MessageScrollerContent and one MessageScrollerItem per message, then add MessageScrollerButton. Put a composer outside the scroll area inside MessageScrollerProvider and call useMessageScroller().scrollToEnd() after sending; set scrollAnchor on the message just sent to bring it to the top. It sits well inside a Window."
never: [Forcing the view to the end while someone reads older messages, A jump key that slides in, Animating each new message in]
source: "Extrapolated from Agentcard: the secondary key (agentcard-website .v7-btn) and the window (.v7-windowbar)"
---
