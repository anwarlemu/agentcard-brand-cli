# Server error page
500 template with the blue hero, a way to try again and the navigation dock.

Install: npx agentcard-ds add server-error-page
Requires: theme, hero, nav-dock, site-header, button
Packages: none
Exports: ServerErrorPage
Client boundary: not required by this entry file
Reference: Built as agentcard-website src/app/not-found.tsx is; the site has no 500 page.


## Usage
Use as the server-error screen of an Agentcard site. Pass onRetry to offer Try again, otherwise it links home.
- Avoid: A stack trace on the page
- Avoid: A footer under the error
- Avoid: More than one key


## Examples
Example components: npx agentcard-ds add server-error-page
[Block](https://agentcard-ds.vercel.app/preview/server-error-page/Block)

examples/server-error-page.tsx

```tsx
import { ServerErrorPage } from "@/components/blocks/server-error-page";

export function Block() {
  return <ServerErrorPage />;
}

```

## Source

components/blocks/server-error-page.tsx

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

// The server error page, built as the site's 404 is (src/app/not-found.tsx): the product pages' blue hero with the
// code in the middle, a line under it, a way to try again and the way home, and the glass dock. The site has no 500
// page of its own; this is the 404's structure with your own words.

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

export function ServerErrorPage({ homeHref = "https://www.agentcard.sh/", onRetry }: { homeHref?: string; onRetry?: () => void }) {
  return (
    <main className="relative">
      <Hero
        header={<SiteHeader href={homeHref} ground="blue" action={START} />}
        background={<Scene />}
        title="500"
        subtitle="Something went wrong on our side. Try again in a moment."
        actions={
          onRetry ? (
            <Button variant="on-brand" onClick={onRetry}>
              Try again
            </Button>
          ) : (
            <Button asChild variant="on-brand">
              <a href={homeHref}>Back to home</a>
            </Button>
          )
        }
        bandTo={null}
      />
      <NavDock menu={PRODUCTS} links={LINKS} action={START} />
    </main>
  );
}

```
