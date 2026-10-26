"use client";

import * as React from "react";
import { SendHorizontal } from "lucide-react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageContent, MessageHeader } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, useMessageScroller } from "@/components/ui/message-scroller";
import { Window } from "@/components/ui/window";

type Entry = { id: number; from: "person" | "agent"; text: string };

const START: Entry[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  from: i % 3 === 2 ? "person" : "agent",
  text: i % 3 === 2 ? "Go ahead, keep it under the card’s limit." : `Found option ${i + 1}: a refurbished monitor for $${180 + i * 7}, delivered Friday.`,
}));

function Composer({ onSend }: { onSend: (text: string) => void }) {
  const { scrollToEnd } = useMessageScroller();
  const [text, setText] = React.useState("");
  return (
    <form
      className="flex items-center gap-2 border-t border-line p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
        scrollToEnd({ behavior: "auto" });
      }}
    >
      <Input aria-label="Message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write to your agent" />
      <Button type="submit" size="icon" className="size-10" aria-label="Send">
        <SendHorizontal />
      </Button>
    </form>
  );
}

export function Site() {
  const [entries, setEntries] = React.useState(START);
  return (
    <Window name="purchase-agent.chat" className="mx-auto h-110 w-full max-w-140" bodyClassName="flex min-h-0 flex-col">
      <MessageScrollerProvider>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4">
              <Marker variant="separator">
                <MarkerContent>Yesterday</MarkerContent>
              </Marker>
              {entries.map((entry) => (
                <MessageScrollerItem key={entry.id}>
                  <Message align={entry.from === "person" ? "end" : "start"}>
                    <MessageContent>
                      <MessageHeader>{entry.from === "person" ? "You" : "Purchase Agent"}</MessageHeader>
                      <Bubble variant={entry.from === "person" ? "default" : "secondary"} align={entry.from === "person" ? "end" : "start"}>
                        <BubbleContent>{entry.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
        <Composer onSend={(text) => setEntries((all) => [...all, { id: all.length, from: "person", text }])} />
      </MessageScrollerProvider>
    </Window>
  );
}

export function Streaming() {
  const [count, setCount] = React.useState(3);
  React.useEffect(() => {
    if (count >= 12) return;
    // ds-latency: simulates incoming purchases in this example; scrolling and input remain immediate.
    const t = setTimeout(() => setCount((c) => c + 1), 900);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <Window name="purchases.log" className="mx-auto h-80 w-full max-w-140" bodyClassName="min-h-0">
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-2">
            {Array.from({ length: count }, (_, i) => (
              <MessageScrollerItem key={i}>
                <Bubble variant="secondary">
                  <BubbleContent>{`Purchase ${i + 1}: $${(24 + i * 11).toFixed(2)} at Staples, approved on the office card.`}</BubbleContent>
                </Bubble>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton direction="start" />
        <MessageScrollerButton />
      </MessageScroller>
    </Window>
  );
}
