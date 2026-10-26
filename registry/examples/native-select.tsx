import { Field } from "@/components/ui/field";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";

export function Site() {
  return (
    <div className="grid w-full max-w-86 gap-4">
      <Field label="Card currency" htmlFor="native-currency">
        <NativeSelect id="native-currency" name="currency" defaultValue="usd">
          <NativeSelectOptGroup label="Most used">
            <NativeSelectOption value="usd">US dollar</NativeSelectOption>
            <NativeSelectOption value="eur">Euro</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Others">
            <NativeSelectOption value="gbp">British pound</NativeSelectOption>
            <NativeSelectOption value="jpy">Japanese yen</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </Field>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-86 gap-4">
      <NativeSelect aria-label="Compact" size="sm" defaultValue="all">
        <NativeSelectOption value="all">All agents</NativeSelectOption>
        <NativeSelectOption value="travel">Travel agent</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-label="Invalid" aria-invalid defaultValue="">
        <NativeSelectOption value="" disabled>
          Choose a merchant category
        </NativeSelectOption>
        <NativeSelectOption value="air">Airlines</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-label="Disabled" disabled defaultValue="usd">
        <NativeSelectOption value="usd">US dollar</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
