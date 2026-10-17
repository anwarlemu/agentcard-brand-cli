"use client";

import * as React from "react";

import { Field } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Site() {
  return (
    <div className="grid max-w-170 gap-4 md:grid-cols-2">
      <Field label="Stage" htmlFor="select-stage">
        <Select>
          <SelectTrigger id="select-stage">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pre">Pre-launch</SelectItem>
            <SelectItem value="launched">Launched</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Money raised" htmlFor="select-raised">
        <Select defaultValue="seed">
          <SelectTrigger id="select-raised">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Bootstrapped</SelectItem>
            <SelectItem value="seed">Under $1M</SelectItem>
            <SelectItem value="a">$1M to $5M</SelectItem>
            <SelectItem value="b">$5M to $20M</SelectItem>
            <SelectItem value="c">More than $20M</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function Open() {
  const [value, setValue] = React.useState("a");
  return (
    <div className="h-80 max-w-83">
      <Field label="Money raised" htmlFor="select-open">
        <Select value={value} onValueChange={setValue} defaultOpen>
          <SelectTrigger id="select-open">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Bootstrapped</SelectItem>
            <SelectItem value="seed">Under $1M</SelectItem>
            <SelectItem value="a">$1M to $5M</SelectItem>
            <SelectItem value="b">$5M to $20M</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="30">
        <SelectTrigger appearance="ghost" aria-label="Period">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger appearance="chip" aria-label="Card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All cards</SelectItem>
          <SelectItem value="travel">Travel agent</SelectItem>
          <SelectItem value="ops">Ops agent</SelectItem>
        </SelectContent>
      </Select>
      <div className="w-56">
        <Select defaultValue="usd">
          <SelectTrigger compact aria-label="Currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">US dollar</SelectItem>
            <SelectItem value="eur">Euro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
