import { TeamDirectory } from "@/components/site/team-directory";

// A neutral stand-in for a photo: initials on a pale block (the directory grays it as it does a photo).
function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span role="img" aria-label={`Photo of ${name}`} className="flex items-center justify-center bg-sky font-display text-body-sm text-fg-brand">
      {letters}
    </span>
  );
}

const TEAM = [
  { name: "Ada Okafor", role: "CEO & Co-Founder" },
  { name: "Luis Romero", role: "CTO & Co-Founder" },
  { name: "Mara Lindqvist", role: "Member of Technical Staff" },
  { name: "Noor Haddad", role: "Member of Marketing Staff" },
];

const INVESTORS = [
  ["Priya Raman", "Co-founder, a fund"],
  ["Tom Becker", "CEO, a commerce platform"],
  ["Elena Ruiz", "CTO, a CRM"],
  ["Sam Wu", "CEO, an auth company"],
  ["Jonas Berg", "CEO, a cloud"],
  ["Ines Duarte", "Board, an AI lab"],
  ["Kofi Mensah", "CEO, a delivery app"],
  ["Hana Sato", "Design, a device maker"],
  ["Ravi Patel", "Payments"],
];

function YMark() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden className="block size-10 flex-none">
      <rect width="40" height="40" className="fill-brand" />
      <path d="M13 11l7 11 7-11M20 22v8" className="fill-none stroke-white" strokeWidth="3" />
    </svg>
  );
}

export function Site() {
  return (
    <div className="mx-auto grid max-w-(--ds-layout-text) gap-16 px-5 py-16 sm:px-0">
      <section aria-labelledby="team">
        <h2 id="team" className="mb-3.5 font-display text-caption font-normal text-fg-brand">
          Team
        </h2>
        <TeamDirectory name="team.dir" tone="blue" columns={2} people={TEAM.map((p) => ({ ...p, photo: <Initials name={p.name} /> }))} />
        <p className="mt-4 text-body-sm text-fg-muted">
          We are not hiring, but you can always send us an{" "}
          <a href="mailto:support@agentcard.sh" className="text-fg-brand underline underline-offset-3">
            email
          </a>
          .
        </p>
      </section>
      <section aria-labelledby="investors">
        <h2 id="investors" className="mb-3.5 font-display text-caption font-normal text-fg-brand">
          Investors
        </h2>
        <TeamDirectory
          name="investors.dir"
          columns={3}
          people={INVESTORS.map(([name, role]) => ({ name, role, photo: <Initials name={name} /> }))}
          footer={[
            { logo: <YMark />, label: "Backed by an accelerator" },
            { logo: <span className="font-display text-h5 tracking-mark text-fg">NORTHFUND</span>, ariaLabel: "North Fund" },
          ]}
        />
      </section>
    </div>
  );
}
