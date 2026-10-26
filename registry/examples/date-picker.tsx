"use client";

import * as React from "react";

import { type DateRange } from "@/components/ui/calendar";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";

const TODAY = new Date(2026, 9, 14);
const days = (n: number) => new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + n);

export function Site() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="w-full max-w-86">
      <Field label="Card expires on">
        <DatePicker value={date} onValueChange={setDate} name="expires" calendar={{ today: TODAY, defaultMonth: TODAY, disabled: { before: TODAY } }} />
      </Field>
    </div>
  );
}

export function Range() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: days(-7), to: TODAY });
  return (
    <div className="w-full max-w-86">
      <Field label="Spending between">
        <DateRangePicker value={range} onValueChange={setRange} name="period" calendar={{ today: TODAY }} />
      </Field>
    </div>
  );
}

export function Presets() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <div className="w-full max-w-86">
      <Field label="Report period">
        <DateRangePicker
          value={range}
          onValueChange={setRange}
          calendar={{ today: TODAY, defaultMonth: TODAY }}
          presets={[
            { label: "Last 7 days", value: { from: days(-7), to: TODAY } },
            { label: "Last 30 days", value: { from: days(-30), to: TODAY } },
            { label: "This month", value: { from: new Date(2026, 9, 1), to: TODAY } },
          ]}
        />
      </Field>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-86 gap-4">
      <DatePicker aria-label="Invalid date" aria-invalid placeholder="Choose a date" />
      <DatePicker aria-label="Disabled date" disabled defaultValue={TODAY} />
    </div>
  );
}
