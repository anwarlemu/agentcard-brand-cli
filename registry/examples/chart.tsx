"use client";

import { AreaChart, BarChart, type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, LineChart, PieChart } from "@/components/ui/chart";

const SPEND = [
  { month: "May", travel: 1860, supplies: 800 },
  { month: "June", travel: 3050, supplies: 1200 },
  { month: "July", travel: 2370, supplies: 1100 },
  { month: "August", travel: 1730, supplies: 1900 },
  { month: "September", travel: 2090, supplies: 1300 },
  { month: "October", travel: 2640, supplies: 1400 },
];

const config = {
  travel: { label: "Travel agent" },
  supplies: { label: "Office supplies" },
} satisfies ChartConfig;

const short = (v: string) => v.slice(0, 3);
const dollars = (v: number) => `$${v.toLocaleString()}`;

export function Site() {
  return (
    <ChartContainer config={config} className="aspect-auto h-80">
      <BarChart data={SPEND} index="month" tickFormatter={short} aria-label="Spend per month by card" />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent />} />
    </ChartContainer>
  );
}

export function Line() {
  return (
    <ChartContainer config={config} className="aspect-auto h-80">
      <LineChart data={SPEND} index="month" tickFormatter={short} showYAxis valueFormatter={dollars} dots aria-label="Spend per month by card" />
      <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
      <ChartLegend content={<ChartLegendContent />} />
    </ChartContainer>
  );
}

export function Area() {
  return (
    <ChartContainer config={config} className="aspect-auto h-80">
      <AreaChart data={SPEND} index="month" tickFormatter={short} stacked aria-label="Spend per month, stacked by card" />
      <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
    </ChartContainer>
  );
}

const PURCHASES = [
  { status: "approved", count: 1240 },
  { status: "review", count: 86 },
  { status: "declined", count: 32 },
];

const purchaseConfig = {
  approved: { label: "Approved", color: "var(--ds-color-chart-series-1)" },
  review: { label: "In review", color: "var(--ds-color-chart-series-3)" },
  declined: { label: "Declined", color: "var(--ds-color-chart-series-4)" },
} satisfies ChartConfig;

export function Pie() {
  return (
    <ChartContainer config={purchaseConfig} className="mx-auto aspect-square max-h-72">
      <PieChart data={PURCHASES} index="status" value="count" aria-label="Agent purchases by status" />
      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
      <ChartLegend content={<ChartLegendContent />} />
    </ChartContainer>
  );
}
