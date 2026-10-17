import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PLANS = [
  { value: "vault", label: "Vault", body: "Store a card once and let your agent pay with a token. Free to start, then per purchase." },
  { value: "issuing", label: "Issuing", body: "Give each agent its own prepaid or commercial card, with limits and a log of every purchase." },
  { value: "agent", label: "Purchase Agent", body: "Hand off the whole checkout. Your agent finds the item and buys it on a card you control." },
];

export function Site() {
  return (
    <Tabs defaultValue="vault" className="max-w-170">
      <TabsList className="w-full">
        {PLANS.map((plan) => (
          <TabsTrigger key={plan.value} value={plan.value}>
            {plan.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PLANS.map((plan) => (
        <TabsContent key={plan.value} value={plan.value} className="text-body text-fg-muted">
          {plan.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function Topics() {
  return (
    <div className="grid gap-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="vault">Vault</TabsTrigger>
          <TabsTrigger value="issuing">Issuing</TabsTrigger>
        </TabsList>
        <TabsContent value="general">Choose a product to learn how agents can pay.</TabsContent>
        <TabsContent value="vault">Store and use existing cards.</TabsContent>
        <TabsContent value="issuing">Create a card for each agent.</TabsContent>
      </Tabs>
      <Tabs defaultValue="month">
        <TabsList size="sm">
          <TabsTrigger value="month">Monthly</TabsTrigger>
          <TabsTrigger value="year">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="month">Billed each month.</TabsContent>
        <TabsContent value="year">Billed once a year.</TabsContent>
      </Tabs>
    </div>
  );
}

export function Plain() {
  return (
    <Tabs defaultValue="all">
      <TabsList variant="plain">
        <TabsTrigger value="all">All purchases</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="declined">Declined</TabsTrigger>
      </TabsList>
      <TabsContent value="all">Delta · Approved. Uber · Declined.</TabsContent>
      <TabsContent value="approved">Delta · Approved.</TabsContent>
      <TabsContent value="declined">Uber · Declined.</TabsContent>
    </Tabs>
  );
}
