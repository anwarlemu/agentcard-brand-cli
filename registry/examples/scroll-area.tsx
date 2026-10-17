import { ScrollArea } from "@/components/ui/scroll-area";
import { Window } from "@/components/ui/window";

const MERCHANTS = ["Delta", "United", "Marriott", "Hilton", "Airbnb", "Uber", "Lyft", "Amazon", "Notion", "Figma", "Linear", "Vercel", "GitHub", "Slack", "Zoom", "OpenTable"];

export function Site() {
  return (
    <Window name="merchants.list" className="h-72 w-72" bodyClassName="flex flex-col">
      <ScrollArea className="px-4 py-2">
        {MERCHANTS.map((merchant) => (
          <p key={merchant} className="border-b border-line py-2.5 font-display text-body-sm text-fg last:border-b-0">
            {merchant}
          </p>
        ))}
      </ScrollArea>
    </Window>
  );
}
