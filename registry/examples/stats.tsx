import { Stats } from "@/components/site/stats";

export function Site() {
  return <Stats title="Acme, in numbers" stats={[{ value: "40%", label: "fewer abandoned carts" }, { value: "12k", label: "purchases approved a week" }, { value: "0", label: "card numbers in a chat" }]} />;
}
