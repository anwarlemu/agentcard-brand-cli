import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Window } from "@/components/ui/window";

const FOUNDERS = [
  { name: "Ada Park", role: "CEO & Co-Founder", initials: "AP" },
  { name: "Jonah Reyes", role: "CTO & Co-Founder", initials: "JR" },
];

const ANGELS = [
  { name: "Mia Chen", role: "Founder, Ledgerline", initials: "MC" },
  { name: "Sam Okafor", role: "Partner, North Fund", initials: "SO" },
  { name: "Lena Ruiz", role: "Angel investor", initials: "LR" },
];

function Person({ person, size }: { person: { name: string; role: string; initials: string }; size?: "md" | "lg" }) {
  return (
    <li className="flex items-center gap-3.5 p-4">
      <Avatar size={size}>
        <AvatarFallback>{person.initials}</AvatarFallback>
      </Avatar>
      <span className="grid min-w-0 gap-1">
        <b className="font-display text-body leading-snug font-medium">{person.name}</b>
        <span className="font-display text-micro [letter-spacing:0.04em] text-fg-muted">{person.role}</span>
      </span>
    </li>
  );
}

export function Site() {
  return (
    <div className="grid w-full max-w-170 gap-6">
      <Window name="team.dir" tone="blue">
        <ul className="grid gap-px bg-line sm:grid-cols-2 [&>li]:bg-surface">
          {FOUNDERS.map((person) => (
            <Person key={person.name} person={person} size="lg" />
          ))}
        </ul>
      </Window>
      <Window name="angels.dir">
        <ul className="grid gap-px bg-line sm:grid-cols-3 [&>li]:bg-surface">
          {ANGELS.map((person) => (
            <Person key={person.name} person={person} />
          ))}
        </ul>
      </Window>
    </div>
  );
}
