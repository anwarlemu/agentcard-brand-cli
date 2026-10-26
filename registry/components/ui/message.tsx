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
