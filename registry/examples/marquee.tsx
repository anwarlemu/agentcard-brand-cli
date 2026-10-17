import { Marquee } from "@/components/visuals/marquee";
import { Surface } from "@/lib/surface";

const MERCHANTS = ["Amazon", "Walmart", "Target", "Best Buy", "Home Depot", "Lowe’s", "Macy’s", "Wayfair", "Staples", "Kohl’s", "B&H Photo", "DoorDash", "Good Eggs", "Locale", "Flights"];

export function Site() {
  return (
    <div className="grid gap-6">
      <Surface ground="blue" className="overflow-hidden rounded-panel py-10">
        <Marquee items={MERCHANTS} label="Agents buy at Amazon, Walmart, Target and more." />
      </Surface>
      <div className="overflow-hidden rounded-panel border border-hairline py-10">
        <Marquee items={MERCHANTS} ground="white" duration={60} />
      </div>
    </div>
  );
}
