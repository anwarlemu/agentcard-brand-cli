# Message
One message in a conversation: a square avatar with sky initials, the sender in the display face with the time beside it, the bubbles and a small footer.

Install: npx agentcard-ds add message
Requires: theme, utils
Packages: none
Exports: Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader
Client boundary: not required by this entry file
Reference: Extrapolated from Agentcard: the About page's square people (agentcard.sh/about), the avatar's sky initials and the quote cards' company line


## Usage
Build a conversation from Message rows inside a MessageGroup: MessageAvatar with initials or a photo, MessageContent with a MessageHeader (the name, then a time element), the Bubble pieces and an optional MessageFooter (Delivered, Read). Set align end for the person's own messages; the row mirrors to the right.
- Avoid: Round avatars
- Avoid: A bold sender name
- Avoid: Timestamps darker than the muted ink


## Examples
Example components: npx agentcard-ds add message bubble
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/message/Site) | [AgentOutput](https://agentcard-ds.vercel.app/preview/message/AgentOutput)

examples/message.tsx

```tsx
import { Check } from "lucide-react";

import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message";

export function Site() {
  return (
    <MessageGroup className="mx-auto w-full max-w-140">
      <Message>
        <MessageAvatar>TA</MessageAvatar>
        <MessageContent>
          <MessageHeader>
            Travel agent <time dateTime="2026-10-14T09:16">9:16 AM</time>
          </MessageHeader>
          <BubbleGroup>
            <Bubble variant="secondary">
              <BubbleContent>The hotel in Boston is $412 for two nights.</BubbleContent>
            </Bubble>
            <Bubble variant="secondary">
              <BubbleContent>That is over the $400 you set for this trip. Should I book it?</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>MK</MessageAvatar>
        <MessageContent>
          <MessageHeader>
            You <time dateTime="2026-10-14T09:18">9:18 AM</time>
          </MessageHeader>
          <Bubble align="end">
            <BubbleContent>Yes, book it. I raised the limit to $450.</BubbleContent>
          </Bubble>
          <MessageFooter>
            <Check strokeWidth={2} /> Delivered
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}

export function AgentOutput() {
  return (
    <Message className="mx-auto max-w-140">
      <MessageAvatar>PA</MessageAvatar>
      <MessageContent>
        <MessageHeader>
          Purchase Agent <time dateTime="2026-10-14T09:20">9:20 AM</time>
        </MessageHeader>
        <Bubble variant="ghost">
          <BubbleContent>I booked two nights at the hotel for $412 with the card ending 7718 and saved the receipt to the trip. The card has $1,588 left this month.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}

```

## Source

components/ui/message.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// One message in an agent conversation (extrapolated from agentcard.sh): a 32px square avatar with no corners, as the
// About page sets its people (initials blue on sky until a photo loads, photos in grayscale), the sender's name in the
// display face at 500 with the time in the 12px display face at 68 percent ink, the bubbles, and a 12px footer
// (Delivered). Outgoing messages (align end) mirror to the right.
function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-group" className={cn("flex min-w-0 flex-col gap-4", className)} {...props} />;
}

function Message({ className, align = "start", ...props }: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return <div data-slot="message" data-align={align} className={cn("group/message relative flex w-full min-w-0 gap-2.5 font-sans text-body-sm data-[align=end]:flex-row-reverse", className)} {...props} />;
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center self-end overflow-hidden bg-window-bar font-display text-caption leading-none text-window-bar-fg group-has-data-[slot=message-footer]/message:-translate-y-6 *:[img]:size-full *:[img]:object-cover *:[img]:grayscale",
        className,
      )}
      {...props}
    />
  );
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-content" className={cn("flex w-full min-w-0 flex-col gap-1.5 break-words group-data-[align=end]/message:items-end", className)} {...props} />;
}

/** The sender and the time, as a quote card names its company: the display face, the time quieter beside it. */
function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 items-baseline gap-2 px-1 font-display text-body-sm leading-snug font-medium tracking-tight text-fg group-data-[align=end]/message:flex-row-reverse [&_time]:text-caption [&_time]:font-normal [&_time]:tracking-normal [&_time]:text-fg-muted group-has-data-[variant=ghost]/message:px-0",
        className,
      )}
      {...props}
    />
  );
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn("flex max-w-full min-w-0 items-center gap-1 px-1 font-display text-caption leading-snug text-fg-subtle group-data-[align=end]/message:justify-end group-has-data-[variant=ghost]/message:px-0 [&_svg:not([class*='size-'])]:size-3", className)}
      {...props}
    />
  );
}

export { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader };

```
