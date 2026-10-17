import { Footer } from "@www/components/footer";
import { Header } from "@www/components/header";
import { BRAND_SITE, GROUPS, REPO, counts, registryName } from "@www/lib/registry";

// The docs pages: the brand header, dock and footer around them. Example previews (app/preview) render bare.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header repo={REPO} library={GROUPS.filter((g) => counts[g.type]).map((g) => ({ title: g.label, description: `${counts[g.type]} items. ${g.blurb}`, href: `/components#${g.id}` }))} />
      {children}
      <Footer name={registryName} repo={REPO} site={BRAND_SITE} />
    </>
  );
}
