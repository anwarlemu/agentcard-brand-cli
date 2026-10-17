import { CreditCard, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function Site() {
  return (
    <EmptyState
      className="max-w-2xl"
      name="cards.list"
      icon={<CreditCard strokeWidth={1.5} />}
      title="No cards yet"
      description="Give your first agent a card, with a limit and a list of places it can buy."
      action={<Button>New card</Button>}
    />
  );
}

export function NoResults() {
  return (
    <EmptyState
      className="max-w-2xl"
      name="search.results"
      icon={<Search strokeWidth={1.5} />}
      title="Nothing matches"
      description="Try a merchant's name or a card's nickname."
      action={<Button variant="secondary">Clear search</Button>}
    />
  );
}
