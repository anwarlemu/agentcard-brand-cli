import { Footer } from "@www/components/footer";
import { Header } from "@www/components/header";
import { BRAND_SITE, GROUPS, REPO, counts, items, registryName } from "@www/lib/registry";

// The docs pages: the brand header, dock and footer around them. Example previews (app/preview) render bare.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const library = GROUPS.filter((g) => counts[g.type]).map((g) => ({ title: g.label, description: `${counts[g.type]} items. ${g.blurb}`, href: `/components#${g.id}` }));
  const label = Object.fromEntries(GROUPS.map((g) => [g.type, g.label]));
  const entries = [
    ...items.map((i) => ({ name: i.name, title: i.title, group: label[i.type] ?? "Library", href: `/components/${i.name}` })),
    { name: "theme", title: "Theme", group: "Docs", href: "/theme" },
  ];
  return (
    <>
      <Header repo={REPO} library={library} entries={entries} />
      {children}
      <Footer name={registryName} repo={REPO} site={BRAND_SITE} />
    </>
  );
}
