"use client";

import * as React from "react";
import { CreditCard, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

export function Site() {
  const [created, setCreated] = React.useState(false);
  return (
    <Empty name="cards.list" className="max-w-2xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CreditCard strokeWidth={1.5} />
        </EmptyMedia>
        <EmptyTitle>{created ? "Travel agent card created" : "No cards yet"}</EmptyTitle>
        <EmptyDescription>{created ? "It is ready to use, with a $500 limit." : "Give your first agent a card, with a limit and a list of places it can buy."}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {created ? (
          <Button variant="secondary" onClick={() => setCreated(false)}>
            Reset demo
          </Button>
        ) : (
          <Button onClick={() => setCreated(true)}>
            <Plus />
            New card
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}

export function NoResults() {
  const [query, setQuery] = React.useState("Hotel booking");
  const cards = ["Travel agent", "Office supplies"].filter((name) => name.toLowerCase().includes(query.toLowerCase().trim()));
  return (
    <div className="grid max-w-2xl gap-4">
      <Input variant="search" aria-label="Search cards" value={query} onChange={(event) => setQuery(event.target.value)} />
      {cards.length ? (
        <ul aria-live="polite">
          {cards.map((name) => (
            <li key={name} className="border-b border-line py-3 text-body-sm">
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <Empty name="search.results">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search strokeWidth={1.5} />
            </EmptyMedia>
            <EmptyTitle>Nothing matches</EmptyTitle>
            <EmptyDescription>Try a merchant’s name or a card’s nickname.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="secondary" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}

export function Bare() {
  return (
    <Empty name={null} className="max-w-md">
      <EmptyHeader>
        <EmptyTitle>No purchases this week</EmptyTitle>
        <EmptyDescription>Purchases your agents make appear here as they happen.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
