import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/code-block";

const CREATE = `import { Agentcard } from "@agentcard/sdk";

// Give the travel agent its own card.
const agentcard = new Agentcard({ apiKey: process.env.AGENTCARD_KEY });
const card = await agentcard.cards.create({
  name: "Travel agent",
  limit: { amount: 200000, interval: "month" },
  merchants: ["flights", "hotels"],
});`;

const CURL = `# Pause a card
curl -X POST https://api.agentcard.sh/v1/cards/card_7718/pause \\
  -H "Authorization: Bearer $AGENTCARD_KEY"`;

const RESPONSE = `{
  "id": "card_7718",
  "status": "active",
  "limit": { "amount": 200000, "interval": "month" },
  "last4": "7718",
  "note": "A long value wraps onto the next line instead of scrolling when wrap is set on the block."
}`;

export function Site() {
  return (
    <div className="rounded-panel bg-brand p-8">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>cards.ts</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={CREATE} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent code={CREATE} language="ts" />
      </CodeBlock>
    </div>
  );
}

export function Terminal() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>Terminal</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={CURL} label="Copy command" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent code={CURL} language="sh" lineNumbers={false} />
    </CodeBlock>
  );
}

export function Wrapped() {
  return (
    <CodeBlock className="max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>response.json</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent code={RESPONSE} language="json" wrap className="max-h-60" />
    </CodeBlock>
  );
}
