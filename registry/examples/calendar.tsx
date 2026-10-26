"use client";

import * as React from "react";

import { Calendar, type DateRange } from "@/components/ui/calendar";

const TODAY = new Date(2026, 9, 14);

export function Site() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 18));
  return <Calendar mode="single" selected={date} onSelect={setDate} today={TODAY} className="rounded-card border border-hairline bg-surface shadow-card" />;
}

export function Range() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(2026, 9, 8), to: new Date(2026, 9, 15) });
  return <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} today={TODAY} className="rounded-card border border-hairline bg-surface shadow-card" />;
}

export function Multiple() {
  const [days, setDays] = React.useState<Date[]>([new Date(2026, 9, 6), new Date(2026, 9, 20)]);
  return <Calendar mode="multiple" selected={days} onSelect={setDays} today={TODAY} />;
}

export function Disabled() {
  const [date, setDate] = React.useState<Date | undefined>();
  return <Calendar mode="single" selected={date} onSelect={setDate} today={TODAY} disabled={[{ before: TODAY }, { dayOfWeek: [0, 6] }]} />;
}

export function Dropdown() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2029, 2, 1));
  return <Calendar mode="single" captionLayout="dropdown" fromYear={2026} toYear={2035} selected={date} onSelect={setDate} today={TODAY} />;
}
