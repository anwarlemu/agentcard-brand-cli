import { NavDock } from "@/components/site/nav-dock";
import { PageHeader } from "@/components/site/page-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Window } from "@/components/ui/window";

// The footer as agentcard.sh carries it on every page: five columns, the line, the running line. Sample categories
// stand in for the merchant names; replace them with your own.
const FOOTER = {
  description: (
    <>
      We want agents to buy anything online
      <br />
      that you can buy as a human.
    </>
  ),
  groups: [
    { title: "Product", links: [{ label: "Vault", href: "https://www.agentcard.sh/vault" }, { label: "Issuing", href: "https://www.agentcard.sh/issuing" }, { label: "Voice", href: "https://cal.com/team/agentcard/agentcard-call" }, { label: "Purchase Agent", href: "https://www.agentcard.sh/purchase-agent" }, { label: "Pricing", href: "https://www.agentcard.sh/pricing" }, { label: "FAQ", href: "https://www.agentcard.sh/#faq" }] },
    { title: "Developers", links: [{ label: "Documentation", href: "https://docs.agentcard.sh" }, { label: "API reference", href: "https://docs.agentcard.sh/companies/api/reference" }] },
    { title: "Company", links: [{ label: "About", href: "https://www.agentcard.sh/about" }, { label: "Changelog", href: "https://www.agentcard.sh/updates" }, { label: "Trust Center", href: "https://app.vanta.com/agentcard.sh/trust/8t52k9fqhneqwt4y2jpvmn" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "https://legal.raincards.xyz/legal/privacy-policy" }, { label: "Terms of Service", href: "https://www.agentcard.sh/terms" }, { label: "Card Terms", href: "https://www.agentcard.sh/card-terms" }, { label: "Card Terms (International)", href: "https://www.agentcard.sh/card-terms-international" }] },
    { title: "Social", links: [{ label: "X / Twitter", href: "https://x.com/agentcardhq" }, { label: "Instagram", href: "https://www.instagram.com/agentcardhq/" }] },
  ],
  merchants: ["Groceries", "Electronics", "Home goods", "Office supplies", "Apparel", "Food delivery", "Software", "Travel", "Books", "Pet supplies", "Hardware", "Flights"],
};

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

// A contact page in the shape of agentcard.sh's form (/get-started): the bare header, the page's opening on the reading
// column, then the form in a window (its heading, a short note, the square fields two to a row on wide screens, the
// blue key), and under it the other ways to reach the team. The blue footer and the glass dock close it. The form posts
// to `action`; validation and sending belong to your app.

const TOPICS = ["Choose one", "Vault", "Issuing", "Purchase Agent", "Pricing", "Something else"];

const CHANNELS = [
  { label: "Email", value: "support@agentcard.sh", href: "mailto:support@agentcard.sh" },
  { label: "Documentation", value: "docs.agentcard.sh", href: "https://docs.agentcard.sh" },
  { label: "A call", value: "Book 30 minutes", href: "https://cal.com/team/agentcard/agentcard-call" },
];

export function ContactPage({ action, method = "post" }: { action?: string; method?: "get" | "post" }) {
  return (
    <main className="relative">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={START} />
      <PageHeader eyebrow="Contact" title="Talk to us">
        <p className="mt-3 font-display text-caption text-fg-muted">A few answers, and we reply within a day</p>
      </PageHeader>
      <div className="mx-auto grid w-(--ds-frame-column) max-w-(--ds-layout-text) gap-10 pt-10 pb-28">
        <Window name="contact.form" raised bodyClassName="p-5 md:p-7">
          <form action={action} method={method} className="grid gap-5">
            <div>
              <h2 className="font-display text-h4 leading-snug font-medium tracking-tight">Tell us about your company</h2>
              <p className="mt-1.5 text-body-sm leading-relaxed text-fg-muted">Tell us what your agent buys and who it buys for, and we’ll point you to the right product.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" required>
                <Input name="name" autoComplete="name" />
              </Field>
              <Field label="Work email" required>
                <Input name="email" type="email" autoComplete="email" />
              </Field>
              <Field label="Company">
                <Input name="company" autoComplete="organization" />
              </Field>
              <Field label="Website">
                <Input name="website" inputMode="url" autoComplete="url" />
              </Field>
            </div>
            <Field label="What is it about?">
              <NativeSelect name="topic" defaultValue="">
                {TOPICS.map((topic, i) => (
                  <NativeSelectOption key={topic} value={i === 0 ? "" : topic} disabled={i === 0}>
                    {topic}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Message" required help="A few sentences is plenty.">
              <Textarea name="message" rows={5} />
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-body-sm text-fg-muted">We only use this to reply to you.</p>
              <Button type="submit">Send message</Button>
            </div>
          </form>
        </Window>
        <section aria-label="Other ways to reach us">
          <ul className="grid gap-4 sm:grid-cols-3">
            {CHANNELS.map((channel) => (
              <li key={channel.label} className="border-t border-hairline pt-3.5">
                <p className="font-display text-caption text-fg-label">{channel.label}</p>
                <a href={channel.href} className="mt-1 inline-block rounded-chip text-body-sm text-fg underline decoration-line-brand underline-offset-[0.2em] outline-none transition-colors duration-150 ease-out hover:text-fg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">
                  {channel.value}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <SiteFooter backing="Backed by Y Combinator" description={FOOTER.description} groups={FOOTER.groups} merchants={FOOTER.merchants} />
      <NavDock menu={PRODUCTS} links={LINKS} action={START} />
    </main>
  );
}
