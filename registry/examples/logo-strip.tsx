import { LogoStrip } from "@/components/site/logo-strip";

const Dot = () => (
  <svg viewBox="0 0 24 24" className="fill-current">
    <circle cx="12" cy="12" r="9" />
  </svg>
);
const Square = () => (
  <svg viewBox="0 0 24 24" className="fill-current">
    <rect x="4" y="4" width="16" height="16" rx="3" />
  </svg>
);
const Ring = () => (
  <svg viewBox="0 0 24 24" className="fill-none stroke-current [stroke-width:2.5]">
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const NAMES = ["Orchid", "Pally", "Almanac", "Endstack", "Pickle", "Persona", "Ego", "Orgo", "Laso Finance", "Bezalel", "Runable", "Paper Instruments"];
const LOGOS = [<Dot key="d" />, <Ring key="r" />, <Square key="s" />];

function Heading({ title, line }: { title: string; line: string }) {
  return (
    <div className="mx-auto max-w-(--ds-layout-heading) text-center">
      <h2 className="font-display text-h2 leading-heading font-medium tracking-tighter">{title}</h2>
      <p className="mt-3.5 text-body-lg leading-6.5 tracking-tight opacity-70">{line}</p>
    </div>
  );
}

export function Site() {
  return (
    <section className="mx-auto w-full max-w-(--ds-frame-column) py-20">
      <Heading title="Working with Agentcard" line="Personal assistant companies use Agentcard as their payment infrastructure." />
      <LogoStrip customers={NAMES.map((name, i) => ({ name, logo: name === "Ego" ? undefined : LOGOS[i % LOGOS.length] }))} />
    </section>
  );
}

export function Few() {
  return (
    <section className="mx-auto w-full max-w-(--ds-frame-column) py-20">
      <Heading title="Working with Agentcard" line="A few of the teams that run their agents’ purchases on it." />
      <LogoStrip customers={NAMES.slice(0, 3).map((name, i) => ({ name, logo: LOGOS[i] }))} />
    </section>
  );
}
