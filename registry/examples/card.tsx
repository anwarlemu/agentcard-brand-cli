import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Site() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Vault</CardTitle>
          <CardDescription>Store a card once. Your agent pays with a token that never leaves the vault.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" asChild><a href="https://www.agentcard.sh/vault" target="_blank" rel="noreferrer">Explore Vault</a></Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Issuing</CardTitle>
          <CardDescription>Give each agent its own card, with a limit, a list of merchants and a log of every purchase.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" asChild><a href="https://www.agentcard.sh/issuing" target="_blank" rel="noreferrer">Explore Issuing</a></Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function Raised() {
  return (
    <Card variant="raised" className="mr-2 mb-2 grid gap-6 md:grid-cols-2 md:gap-12">
      {/* The product's screen or object goes here; a tinted block holds its place. */}
      <div aria-hidden className="aspect-[4/3] rounded-card bg-brand" />
      <CardContent className="flex flex-col justify-center gap-4 p-3 md:p-6">
        <CardTitle className="text-h2 font-normal tracking-tighter">Prepaid cards for every agent</CardTitle>
        <CardDescription className="text-body-lg">Fund a card, choose what it can buy, and hand it to your agent.</CardDescription>
        <div>
          <Button asChild><a href="https://app.agentcard.sh/" target="_blank" rel="noreferrer">Start free</a></Button>
        </div>
      </CardContent>
    </Card>
  );
}
