"use client";

import * as React from "react";
import { ArrowUpRight, CreditCard, Plane, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";

const CARDS = [
  { name: "Travel agent", detail: "Multi-use, $2,000 a month. Flights and hotels only.", icon: Plane, status: "Active" },
  { name: "Office supplies", detail: "Single-use, $250. Staples and Amazon.", icon: ShoppingBag, status: "Active" },
  { name: "Gift cards", detail: "Closed after one purchase on Oct 12.", icon: CreditCard, status: "Closed" },
];

export function Site() {
  const [current, setCurrent] = React.useState(CARDS[0].name);
  return (
    <ItemGroup className="w-full max-w-md">
      {CARDS.map((card) => (
        <Item key={card.name} asChild aria-current={current === card.name ? "true" : undefined}>
          <button type="button" className="w-full text-left" onClick={() => setCurrent(card.name)}>
            <ItemMedia variant="icon">
              <card.icon strokeWidth={1.5} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{card.name}</ItemTitle>
              <ItemDescription>{card.detail}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant={card.status === "Active" ? "success" : "default"}>{card.status}</Badge>
            </ItemActions>
          </button>
        </Item>
      ))}
    </ItemGroup>
  );
}

export function Variants() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Vault</ItemTitle>
          <ItemDescription>Store customers’ cards and let agents use them safely.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="secondary" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Purchase Agent</ItemTitle>
          <ItemDescription>Buys from Amazon, DoorDash and other stores for your agent.</ItemDescription>
        </ItemContent>
      </Item>
      <Item asChild size="xs">
        <a href="https://www.agentcard.sh/updates" target="_blank" rel="noreferrer">
          <ItemContent>
            <ItemTitle>Read the updates</ItemTitle>
          </ItemContent>
          <ArrowUpRight aria-hidden className="size-3.5 text-fg-muted" />
        </a>
      </Item>
    </div>
  );
}

export function Feed() {
  const entries = [
    { when: "Oct 14", tag: "New", title: "Voice orders", body: "Agents can now place orders over the phone with their card." },
    { when: "Oct 2", tag: "Fix", title: "Card limits reset on time", body: "Monthly limits now reset at midnight in the card’s time zone." },
  ];
  return (
    <ItemGroup className="w-full max-w-lg">
      {entries.map((entry, i) => (
        <React.Fragment key={entry.title}>
          {i > 0 && <ItemSeparator />}
          <Item size="sm">
            <ItemHeader>
              <span>{entry.when}</span>
              <Badge variant={entry.tag === "New" ? "tag" : "tag-heart"}>{entry.tag}</Badge>
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{entry.title}</ItemTitle>
              <ItemDescription>{entry.body}</ItemDescription>
            </ItemContent>
            <ItemFooter>
              <span>agentcard.sh/updates</span>
            </ItemFooter>
          </Item>
        </React.Fragment>
      ))}
    </ItemGroup>
  );
}
