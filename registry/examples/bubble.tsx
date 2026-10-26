import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";

export function Site() {
  return (
    <div className="mx-auto flex w-full max-w-120 flex-col gap-3">
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>I found two train tickets to Boston for Friday, $184 in total.</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>Should I buy them with the travel card?</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>Yes, go ahead. Keep it under $200.</BubbleContent>
        <BubbleReactions align="start">👍</BubbleReactions>
      </Bubble>
    </div>
  );
}

export function Variants() {
  return (
    <div className="mx-auto flex w-full max-w-120 flex-col gap-3">
      <Bubble variant="tinted">
        <BubbleContent>Purchase Agent: the order is placed. Confirmation number 4182.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Travel card limit raised to $2,500 for this month.</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Quoted: Card ending 7718, multi-use, $2,000 a month.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="end">
        <BubbleContent>Not sent. The card was paused before the purchase.</BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>A ghost bubble sets text without a box, for long agent output such as an order summary.</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent asChild>
          <button type="button">Retry the purchase</button>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
