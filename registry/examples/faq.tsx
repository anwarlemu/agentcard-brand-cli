import { Faq } from "@/components/site/faq";

export function Site() {
  return (
    <section className="mx-auto w-full max-w-(--ds-frame-column) py-20">
      <Faq
        bar="faq.help / Agentcard"
        title="Frequently asked questions"
        lead="Everything you need to know about Agentcard."
        topics={[
          {
            label: "General",
            items: [
              { question: "What does Agentcard do?", answer: "Agentcard lets AI agents buy anything online: it stores your customers’ cards or issues new ones, and pays where a human would." },
              { question: "Vault or Issuing: which should we start with?", answer: "Vault if your customers already have cards they want their agent to use; Issuing if the agent should spend from a card you fund." },
              { question: "Is Agentcard B2B or for consumers?", answer: "Both. Consumer apps store their users’ cards; companies give cards to their own agents." },
              { question: "Does the merchant need to integrate anything?", answer: "No. The agent pays at checkout with a card, as a person would." },
              { question: "How is this different from Stripe Link?", answer: "Link fills in a saved card for a person. Agentcard lets an agent pay on its own, within the limits the owner sets." },
              { question: "How does the Purchase Agent work, and how reliable is it?", answer: "It drives a real browser through checkout and hands the result back to your agent." },
              { question: "Do you support x402, AP2 or other agent payment protocols?", answer: "Yes, where the merchant supports them; a card works everywhere else." },
            ],
          },
          {
            label: "Vault",
            items: [
              { question: "Where are the cards stored?", answer: "Cards are encrypted on the user’s device before they are stored." },
              { question: "Can users approve each payment?", answer: "Yes, with their passkey or master password, or automatically within the limits they set." },
              { question: "Who owns the Vault?", answer: "You do, and so does every card in it." },
            ],
          },
          {
            label: "Issuing",
            items: [
              { question: "What kinds of cards can we issue?", answer: "One-time cards for a single purchase, and multi-use cards with a monthly limit." },
              { question: "How are the cards funded?", answer: "From a balance you top up." },
            ],
          },
        ]}
      />
    </section>
  );
}
