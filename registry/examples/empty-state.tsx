"use client";

import { useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";

export function Site() {
  const [created, setCreated] = useState(false);
  return created ? <div className="grid gap-3"><p role="status">Travel agent card created.</p><Button variant="secondary" onClick={() => setCreated(false)}>Reset demo</Button></div> :
    <EmptyState className="max-w-2xl" name="cards.list" icon={<CreditCard strokeWidth={1.5} />} title="No cards yet"
      description="Give your first agent a card, with a limit and a list of places it can buy." action={<Button onClick={() => setCreated(true)}>New card</Button>} />;
}
export function NoResults() {
  const [query, setQuery] = useState("No matching card");
  const results = ["Travel agent", "Office supplies"].filter((name) => name.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className="grid max-w-2xl gap-4">
    <Input variant="search" aria-label="Search cards" value={query} onChange={(event) => setQuery(event.target.value)} />
    {results.length ? <ul aria-live="polite">{results.map((name) => <li key={name} className="border-b border-line py-3">{name}</li>)}</ul> :
      <EmptyState name="search.results" icon={<Search strokeWidth={1.5} />} title="Nothing matches" description="Try a merchant’s name or a card’s nickname." action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>} />}
  </div>;
}
