import { CreditCard, ShoppingCart } from "lucide-react";

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

export function Site() {
  return (
    <div className="mx-auto grid w-full max-w-120 gap-5">
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <CreditCard strokeWidth={1.5} />
        </MarkerIcon>
        <MarkerContent>Travel agent was issued a new card</MarkerContent>
      </Marker>
      <Marker variant="unread">
        <MarkerContent>2 new purchases</MarkerContent>
      </Marker>
    </div>
  );
}

export function Variants() {
  return (
    <div className="mx-auto grid w-full max-w-120 gap-5">
      <Marker variant="border">
        <MarkerContent>Purchases</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <ShoppingCart strokeWidth={1.5} />
        </MarkerIcon>
        <MarkerContent>
          Bought two train tickets for $184. <a href="#receipt">View receipt</a>
        </MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Oct 12</MarkerContent>
      </Marker>
    </div>
  );
}
