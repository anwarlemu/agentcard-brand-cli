import { Newsletter } from "@/components/site/newsletter";

export function Site() {
  return <Newsletter title="Product news" description="One email when something ships." done="Thanks. Check your inbox to confirm." onSubmit={async () => {}} />;
}
