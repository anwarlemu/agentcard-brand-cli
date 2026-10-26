import { TypographyBlockquote, TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyInlineCode, TypographyLarge, TypographyLead, TypographyList, TypographyMuted, TypographyP, TypographySmall, TypographyTable } from "@/components/ui/typography";

export function Site() {
  return (
    <article className="w-full max-w-2xl">
      <TypographyH2>Give your agent a card</TypographyH2>
      <TypographyLead>Each card has its own limit and a list of places it can buy.</TypographyLead>
      <TypographyP>
        Create a card with <TypographyInlineCode>agentcard.cards.create</TypographyInlineCode>, then hand its number to your agent. Purchases it makes show up in the dashboard as they happen.
      </TypographyP>
      <TypographyBlockquote>“Our Slack agent buys office supplies without anyone sharing a company card.”</TypographyBlockquote>
      <TypographyList>
        <li>Set a monthly or single-use limit.</li>
        <li>Choose the merchants it can pay.</li>
        <li>Pause it at any time.</li>
      </TypographyList>
      <TypographyTable>
        <thead>
          <tr>
            <th>Card</th>
            <th>Limit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Travel agent</td>
            <td>$2,000 a month</td>
          </tr>
          <tr>
            <td>Office supplies</td>
            <td>$250 once</td>
          </tr>
        </tbody>
      </TypographyTable>
    </article>
  );
}

export function Scale() {
  return (
    <div className="grid w-full max-w-2xl gap-3">
      <TypographyH1>Let agents buy anything online</TypographyH1>
      <TypographyH2>Explore our products</TypographyH2>
      <TypographyH3>Vault</TypographyH3>
      <TypographyH4>Purchase Agent</TypographyH4>
      <TypographyLarge>Commercial cards</TypographyLarge>
      <TypographyP>Store customers’ cards and make purchases with agents safely.</TypographyP>
      <TypographyMuted>Consumer apps, B2B companies and crypto teams run their agents’ purchases on Agentcard.</TypographyMuted>
      <TypographySmall>Updated Oct 14</TypographySmall>
      <TypographyList ordered>
        <li>Create a card.</li>
        <li>Give it to your agent.</li>
      </TypographyList>
    </div>
  );
}
