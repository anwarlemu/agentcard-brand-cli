import { Steps } from "@/components/site/steps";

export function Site() {
  return <Steps title="How it works" steps={[{ title: "Save it once", description: "Your user adds their card a single time." }, { title: "The agent asks", description: "It never sees the number." }, { title: "You approve", description: "With a passkey, tied to that exact cart." }]} />;
}
