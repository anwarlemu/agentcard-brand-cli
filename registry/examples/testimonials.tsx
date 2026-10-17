import { Testimonials } from "@/components/site/testimonials";

const Mark = ({ d }: { d: string }) => (
  <svg viewBox="0 0 20 20" className="fill-current">
    <path d={d} />
  </svg>
);

export function Site() {
  return (
    <section className="mx-auto w-full max-w-(--ds-frame-column) py-20">
      <div className="mx-auto max-w-(--ds-layout-heading) text-center">
        <h2 className="font-display text-h2 leading-heading font-medium tracking-tighter">Powering payments for agentic startups</h2>
        <p className="mt-3.5 text-body-lg leading-6.5 tracking-tight opacity-70">
          Consumer apps, B2B companies and crypto teams run their agents’ purchases on Agentcard.
        </p>
      </div>
      <Testimonials
        cases={[
          {
            name: "Orchid",
            logo: <Mark d="M10 2a3 3 0 0 1 3 3 3 3 0 1 1 2 5 3 3 0 1 1-3 5 3 3 0 1 1-4 0 3 3 0 1 1-3-5 3 3 0 1 1 2-5 3 3 0 0 1 3-3Z" />,
            context: "Consumer apps like Orchid buy on Amazon for customers using Agentcard:",
            quote: "Orchid uses Agentcard to store customers’ cards safely and buy things on their behalf.”",
            tag: "Consumer",
          },
          {
            name: "Almanac",
            logo: <Mark d="M10 1a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />,
            context: "B2B companies like Almanac use Agentcard to give cards to company agents:",
            quote: "Almanac stores corporate cards using Agentcard and automates company purchases with their Slack agent.”",
            tag: "B2B",
          },
          {
            name: "Laso Finance",
            file: "laso.case",
            logo: <Mark d="M3 5l7-3 7 3v10l-7 3-7-3Z" />,
            context: "Crypto companies like Laso use Agentcard as their payment infrastructure:",
            quote: "When users have funds in crypto and their agent wants to make purchases using them, they can use Laso (powered by Agentcard) and create cards their agent can use.”",
            tag: "Crypto",
          },
        ]}
      />
    </section>
  );
}
