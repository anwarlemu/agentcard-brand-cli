import { SiteFooter } from "@/components/site/site-footer";

// The docs footer: the library's own blue footer, with the docs' sitemap.
export function Footer({ name, repo, site }: { name: string; repo: string; site: string }) {
  return (
    <SiteFooter
      id="docs-footer"
      description={
        <>
          Components, tokens and guidance
          <br />
          for building {name} interfaces.
        </>
      }
      groups={[
        { title: "Library", links: [{ label: "Components", href: "/components#components" }, { label: "Sections", href: "/components#site" }, { label: "Pages", href: "/components#blocks" }, { label: "Visuals", href: "/components#visuals" }] },
        { title: "Reference", links: [{ label: "Theme", href: "/theme" }, { label: "Text reference", href: "/llms.txt" }, { label: "Registry index", href: "/r/index.json" }] },
        { title: name, links: [{ label: "Website", href: site, external: true }, { label: "GitHub", href: repo, external: true }] },
      ]}
    />
  );
}
