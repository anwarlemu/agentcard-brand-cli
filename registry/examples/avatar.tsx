import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TEAM = [
  { name: "Ada Park", initials: "AP" },
  { name: "Jonah Reyes", initials: "JR" },
  { name: "Mia Chen", initials: "MC" },
];

export function Site() {
  return (
    <div className="grid gap-6">
      <ul className="grid gap-3">
        {TEAM.map((person) => (
          <li key={person.name} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{person.initials}</AvatarFallback>
            </Avatar>
            <span className="font-display text-body-sm text-fg">{person.name}</span>
          </li>
        ))}
      </ul>
      <div className="flex -space-x-2">
        {TEAM.map((person) => (
          <Avatar key={person.name} className="size-10 ring-2 ring-white">
            <AvatarFallback>{person.initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
