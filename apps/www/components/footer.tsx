import { Lockup } from "@www/components/logo";

// The docs footer: the blue ground after four stepped bands, as on the brand's pages.
export function Footer({ name, repo, site }: { name: string; repo: string; site: string }) {
  return (
    <footer>
      <div aria-hidden className="ds-band h-9 bg-[linear-gradient(color-mix(in_srgb,var(--ds-color-bg-brand)_24%,var(--ds-color-bg-default))_0_25%,color-mix(in_srgb,var(--ds-color-bg-brand)_48%,var(--ds-color-bg-default))_25%_50%,color-mix(in_srgb,var(--ds-color-bg-brand)_70%,var(--ds-color-bg-default))_50%_75%,color-mix(in_srgb,var(--ds-color-bg-brand)_88%,var(--ds-color-bg-default))_75%_100%)]" />
      <div className="bg-brand text-on-brand">
        <div className="mx-auto flex max-w-(--ds-frame-column) flex-wrap justify-between gap-10 py-16 font-display text-caption">
          <div className="grid gap-3">
            <Lockup className="h-7 text-white" label={name} />
            <p className="max-w-60 text-body-sm">The {name} design system, and a CLI that applies it to any site.</p>
          </div>
          <nav className="flex gap-16">
            <ul className="grid gap-2">
              <li className="text-fg-on-brand-label">Library</li>
              <li><a href="/components">Components</a></li>
              <li><a href="/theme">Theme</a></li>
              <li><a href="/cli">CLI</a></li>
            </ul>
            <ul className="grid gap-2">
              <li className="text-fg-on-brand-label">{name}</li>
              <li><a href={site}>Website</a></li>
              <li><a href={repo}>GitHub</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
