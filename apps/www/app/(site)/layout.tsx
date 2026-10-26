import { DocsRail } from "@www/components/sidebar";
import { BRAND_SITE, GROUPS, REPO, items } from "@www/lib/registry";

// Every docs page shares one shell: the rail at the left (kept mounted between pages, so it keeps its scroll and
// filter) and the page beside it. Example previews (app/preview) render bare.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const groups = GROUPS.map((g) => ({ label: g.label, items: items.filter((i) => i.type === g.type).map((i) => ({ name: i.name, title: i.title })).sort((a, b) => a.title.localeCompare(b.title)) })).filter((g) => g.items.length);
  return (
    <div className="lg:flex">
      <DocsRail groups={groups} repo={REPO} site={BRAND_SITE} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
