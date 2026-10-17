import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Window } from "@/components/ui/window";

const GENERAL = [
  { q: "What does Agentcard do?", a: "It lets AI agents pay at real checkouts. You fund a card, set what it can buy, and your agent uses it like a person would." },
  { q: "Do I need to write code?", a: "No. Connect your agent with the command line tool or the API, or share a card with an agent you already use." },
  { q: "Is my card number shared with the agent?", a: "Never. The agent gets a token that only works within the limits you set, and you can pause it at any time." },
  { q: "What does it cost?", a: "Starting is free. You pay per card and per purchase as your agents buy more; see the pricing page for details." },
];

function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible defaultValue="item-0" className="w-full max-w-170">
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function Site() {
  return <Faq items={GENERAL} />;
}

export function InWindow() {
  return (
    <Window name="faq.help / Agentcard" className="mx-auto max-w-198" bodyClassName="flex flex-col items-center px-4 pt-10 pb-12 md:px-14">
      <h2 className="text-h2 leading-heading tracking-tighter">Questions, answered</h2>
      <Tabs defaultValue="general" className="mt-9 w-full max-w-170 items-center gap-9">
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="vault">Vault</TabsTrigger>
          <TabsTrigger value="issuing">Issuing</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="w-full">
          <Faq items={GENERAL} />
        </TabsContent>
        <TabsContent value="vault" className="w-full">
          <Faq items={GENERAL.slice(2)} />
        </TabsContent>
        <TabsContent value="issuing" className="w-full">
          <Faq items={GENERAL.slice(1, 3)} />
        </TabsContent>
      </Tabs>
    </Window>
  );
}
