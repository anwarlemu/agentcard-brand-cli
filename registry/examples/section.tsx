import { Eyebrow, SectionHeading, SiteSection } from "@/components/site/section";
import { Window } from "@/components/ui/window";

function Placeholder({ name }: { name: string }) {
  return (
    <Window name={name} className="h-48" bodyClassName="flex items-center justify-center bg-sky-wash font-display text-caption text-fg-label">
      Content
    </Window>
  );
}

export function Site() {
  return (
    <>
      <SiteSection>
        <SectionHeading title="Powering payments for agentic startups" description="Consumer apps, B2B companies and crypto platforms use Agentcard to let their agents pay." />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Placeholder name="first.case" />
          <Placeholder name="second.case" />
          <Placeholder name="third.case" />
        </div>
      </SiteSection>
      <SiteSection ground="paper">
        <SectionHeading eyebrow="Products" title="Explore our products" description="Vault, Issuing, Voice and the Purchase Agent." />
      </SiteSection>
      <SiteSection ground="blue">
        <Eyebrow>On the blue</Eyebrow>
        <SectionHeading align="start" className="mt-2.5" title="A lit band" description="White text, sky labels." />
      </SiteSection>
    </>
  );
}
