import { CircleAlert, CreditCard, Receipt, RotateCw, Search, ShoppingCart, Store } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { Trace, TraceCollapsible, TraceCollapsibleContent, TraceCollapsibleTrigger, TraceDescription, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace";

export function Site() {
  return (
    <Trace className="mx-auto max-w-120">
      <TraceLine>
        <TraceIcon>
          <Search strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Searched three stores for a 27 inch monitor</TraceTitle>
        <TraceDescription>2.1s</TraceDescription>
      </TraceLine>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Store strokeWidth={1.75} />
            </TraceIcon>
            <TraceTitle>Compared prices</TraceTitle>
            <TraceDescription>3 results</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>Best Buy has it for $229 with delivery on Friday; Amazon and B&amp;H are $15 more.</TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceLine status="running">
        <TraceIcon>
          <Spinner />
        </TraceIcon>
        <TraceTitle>Paying with the card ending 7718</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <Receipt strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Save the receipt to the office expenses</TraceTitle>
      </TraceLine>
    </Trace>
  );
}

export function Failed() {
  return (
    <Trace className="mx-auto max-w-120">
      <TraceLine>
        <TraceIcon>
          <ShoppingCart strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Added two train tickets to the cart</TraceTitle>
        <TraceDescription>0.4s</TraceDescription>
      </TraceLine>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <CircleAlert strokeWidth={1.75} />
            </TraceIcon>
            <TraceTitle>The card was declined</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>The purchase was $212, over the travel card’s $200 limit. Raise the limit or choose a cheaper fare.</TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceLine>
        <TraceIcon>
          <RotateCw strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Waiting for a new limit</TraceTitle>
        <TraceDescription>paused</TraceDescription>
      </TraceLine>
    </Trace>
  );
}

export function Linked() {
  return (
    <Trace className="mx-auto max-w-120">
      <a href="#receipt">
        <TraceLine>
          <TraceIcon>
            <Receipt strokeWidth={1.75} />
          </TraceIcon>
          <TraceTitle>Opened the receipt from Best Buy</TraceTitle>
        </TraceLine>
      </a>
      <button type="button">
        <TraceLine>
          <TraceIcon>
            <CreditCard strokeWidth={1.75} />
          </TraceIcon>
          <TraceTitle>Showed the card’s remaining limit</TraceTitle>
        </TraceLine>
      </button>
    </Trace>
  );
}
