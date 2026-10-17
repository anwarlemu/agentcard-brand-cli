import { Hero } from "@/components/site/hero";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";

// Stand-ins for the site's 3D objects: pale tiles scattered round the title, drawn from brand tokens only.
const TILES = [
  "left-[6%] top-[14%] size-20 rotate-12 bg-sky",
  "left-[16%] top-[58%] h-16 w-24 -rotate-6 bg-white",
  "left-[30%] top-[8%] size-14 -rotate-12 bg-blue-mid",
  "right-[8%] top-[20%] h-20 w-28 rotate-6 bg-white",
  "right-[18%] top-[64%] size-16 -rotate-12 bg-sky",
  "right-[34%] top-[80%] size-12 rotate-12 bg-blue-mid",
  "left-[44%] top-[84%] h-12 w-20 rotate-3 bg-sky",
];

function Scene() {
  return (
    <div aria-hidden className="absolute inset-0">
      {TILES.map((tile) => (
        <span key={tile} className={`absolute rounded-card opacity-80 shadow-card ${tile}`} />
      ))}
    </div>
  );
}

export function Site() {
  return (
    <Hero
      header={<SiteHeader href="https://www.agentcard.sh/" ground="blue" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />}
      background={<Scene />}
      title="Let agents buy anything online"
      subtitle="Cards your agents can use anywhere, under limits you set."
      actions={
        <Button asChild variant="on-brand">
          <a href="https://app.agentcard.sh/">Get started</a>
        </Button>
      }
    />
  );
}

export function Tilted() {
  return <Hero header={<SiteHeader href="https://www.agentcard.sh/" ground="blue" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />} background={<Scene />} title="Let agents buy anything online" tilt />;
}
