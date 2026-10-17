import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";

export function Site() {
  return (
    <div className="grid max-w-3xl gap-4">
      <Banner title="Voice is in beta" actions={<Button size="sm">Try Voice</Button>}>
        Your agent can now place orders over the phone.
      </Banner>
      <Banner
        tone="brand"
        title="Commercial cards are here"
        actions={
          <Button variant="on-brand" size="sm">
            See Issuing
          </Button>
        }
      >
        Issue a card per agent with its own limits.
      </Banner>
      <Banner tone="alert" title="Travel agent was paused" actions={<Button variant="secondary" size="sm">Review</Button>}>
        It hit its monthly limit on Oct 14.
      </Banner>
    </div>
  );
}
