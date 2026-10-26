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
