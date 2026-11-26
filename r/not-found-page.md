# Not found page
404 template with the blue hero, a way home and the navigation dock.

Install: npx agentcard-ds add not-found-page
Requires: theme, hero, nav-dock, site-header, button
Packages: none
Exports: NotFoundPage
Client boundary: not required by this entry file
Reference: agentcard-website src/app/not-found.tsx; agentcard.sh 404 (computed)


## Usage
Use as the page-not-found screen of an Agentcard site. Pass homeHref and your own hero imagery.
- Avoid: A footer under the 404
- Avoid: Jokes or illustrations in place of the way home
- Avoid: More than one key
- Avoid: A white page


## Examples
Example components: npx agentcard-ds add not-found-page
[Block](https://agentcard-ds.vercel.app/preview/not-found-page/Block)

examples/not-found-page.tsx

```tsx
import { NotFoundPage } from "@/components/blocks/not-found-page";

export function Block() {
  return <NotFoundPage />;
}

```

## Source

components/blocks/not-found-page.tsx

```tsx
import { Hero } from "@/components/site/hero";
import { NavDock } from "@/components/site/nav-dock";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";

// The dock as agentcard.sh carries it: Home, the Products menu, About, Pricing, and Get started.
const PRODUCTS = {
  label: "Products",
  items: [
    { title: "Vault", description: "Store customers’ cards and buy with an agent.", href: "https://www.agentcard.sh/vault" },
    { title: "Issuing", description: "One-time and multi-use cards for your agent.", href: "https://www.agentcard.sh/issuing" },
    { title: "Voice", description: "Approve an agent’s purchase by speaking.", href: "https://cal.com/team/agentcard/agentcard-call" },
    { title: "Purchase Agent", description: "Buy from the stores people already use.", href: "https://www.agentcard.sh/purchase-agent" },
  ],
};

const LINKS = [
  { label: "Home", href: "https://www.agentcard.sh/" },
  { label: "About", href: "https://www.agentcard.sh/about" },
  { label: "Pricing", href: "https://www.agentcard.sh/pricing" },
];

const START = { label: "Get started", href: "https://app.agentcard.sh/" };

// The 404 as agentcard.sh draws it (src/app/not-found.tsx): the product pages' blue hero with 404 in the middle, the
// page-not-found line under it and the way home, and no footer: the glass dock is the way back. Sample scene; pass
// your own imagery as the hero's background.

function Tile({ className }: { className: string }) {
  return <span aria-hidden className={`absolute rounded-card opacity-80 shadow-card ${className}`} />;
}

function Scene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <Tile className="top-[14%] left-[6%] size-20 rotate-12 bg-sky" />
      <Tile className="top-[78%] left-[8%] md:top-[58%] md:left-[16%] h-16 w-24 -rotate-6 bg-white" />
      <Tile className="top-[20%] right-[8%] h-20 w-28 rotate-6 bg-white" />
      <Tile className="top-[84%] right-[10%] md:top-[64%] md:right-[18%] size-16 -rotate-12 bg-sky" />
    </div>
  );
}

export function NotFoundPage({ homeHref = "https://www.agentcard.sh/" }: { homeHref?: string }) {
  return (
    <main className="relative">
      <Hero
        header={<SiteHeader href={homeHref} ground="blue" action={START} />}
        background={<Scene />}
        title="404"
        subtitle="Page not found. The page you are looking for has moved or never existed."
        actions={
          <Button asChild variant="on-brand">
            <a href={homeHref}>Back to home</a>
          </Button>
        }
        bandTo={null}
      />
      <NavDock menu={PRODUCTS} links={LINKS} action={START} />
    </main>
  );
}

```
