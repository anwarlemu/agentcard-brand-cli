"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

const MERCHANTS = [
  { value: "united", label: "United Airlines" },
  { value: "delta", label: "Delta Air Lines" },
  { value: "marriott", label: "Marriott" },
  { value: "hilton", label: "Hilton" },
  { value: "figma", label: "Figma" },
  { value: "notion", label: "Notion" },
  { value: "casino", label: "Online casino", disabled: true },
];

export function Site() {
  const [merchant, setMerchant] = React.useState<string | null>("united");
  return (
    <div className="grid w-full max-w-86 gap-1.5">
      <Label id="merchant-label">Merchant</Label>
      <Combobox items={MERCHANTS} value={merchant} onValueChange={setMerchant} name="merchant">
        <ComboboxTrigger aria-labelledby="merchant-label">
          <ComboboxValue placeholder="Choose a merchant" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search merchants" />
          <ComboboxList>
            <ComboboxEmpty>No merchant with that name.</ComboboxEmpty>
            {MERCHANTS.map((m) => (
              <ComboboxItem key={m.value} value={m.value} label={m.label} disabled={m.disabled}>
                {m.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function Multiple() {
  const [values, setValues] = React.useState<string[]>(["united", "marriott"]);
  return (
    <div className="grid w-full max-w-100 gap-1.5">
      <Label htmlFor="merchants-input">Allowed merchants</Label>
      <Combobox multiple items={MERCHANTS} value={values} onValueChange={setValues}>
        <ComboboxChips>
          {values.map((v) => (
            <ComboboxChip key={v} value={v} />
          ))}
          <ComboboxChipsInput id="merchants-input" placeholder={values.length ? "" : "Add merchants"} />
          <ComboboxClear />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No merchant with that name.</ComboboxEmpty>
            {MERCHANTS.map((m) => (
              <ComboboxItem key={m.value} value={m.value} label={m.label} disabled={m.disabled} />
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function Groups() {
  return (
    <div className="grid w-full max-w-86 gap-1.5">
      <Label id="grouped-label">Merchant</Label>
      <Combobox items={MERCHANTS}>
        <ComboboxTrigger aria-labelledby="grouped-label" />
        <ComboboxContent>
          <ComboboxInput placeholder="Search merchants" />
          <ComboboxList>
            <ComboboxEmpty>No merchant with that name.</ComboboxEmpty>
            <ComboboxGroup heading="Travel">
              {MERCHANTS.slice(0, 4).map((m) => <ComboboxItem key={m.value} value={m.value} label={m.label} />)}
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup heading="Software">
              {MERCHANTS.slice(4, 6).map((m) => <ComboboxItem key={m.value} value={m.value} label={m.label} />)}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-86 gap-4">
      <Combobox items={MERCHANTS} disabled>
        <ComboboxTrigger aria-label="Disabled merchant" />
      </Combobox>
      <Combobox items={MERCHANTS}>
        <ComboboxTrigger aria-label="Invalid merchant" aria-invalid>
          <ComboboxValue placeholder="Choose a merchant" />
        </ComboboxTrigger>
      </Combobox>
    </div>
  );
}
