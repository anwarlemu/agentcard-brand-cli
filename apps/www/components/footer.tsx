import { SiteFooter } from "@/components/site/site-footer";

// The docs footer: the library's own blue footer, with the docs' sitemap.
export function Footer({ name, repo, site }: { name: string; repo: string; site: string }) {
  return (
    <SiteFooter
      id="docs-footer"
      description={
        <>
          The {name} design system,
          <br />
          and a CLI that applies it anywhere.
        </>
      }
      groups={[
        { title: "Library", links: [{ label: "Components", href: "/components#components" }, { label: "Sections", href: "/components#site" }, { label: "Pages", href: "/components#blocks" }, { label: "Visuals", href: "/components#visuals" }] },
        { title: "Use it", links: [{ label: "Theme", href: "/theme" }, { label: "CLI", href: "/cli" }, { label: "Registry index", href: "/r/index.json" }] },
        { title: name, links: [{ label: "Website", href: site, external: true }, { label: "GitHub", href: repo, external: true }] },
      ]}
    />
  );
}
