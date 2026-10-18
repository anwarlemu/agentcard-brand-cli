"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Site() {
  return (
    <div className="grid max-w-170 gap-4 sm:grid-cols-2">
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

export function Controlled() {
  const [value, setValue] = React.useState("a");
  return (
    <div className="h-80 max-w-83">
      <Field label="Money raised" htmlFor="select-open">
        <Select value={value} onValueChange={setValue}>
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
        <SelectContent compact>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger appearance="chip" aria-label="Card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent compact>
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
          <SelectContent compact>
            <SelectItem value="usd">US dollar</SelectItem>
            <SelectItem value="eur">Euro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function Form() {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState("");
  return (
    <form className="grid min-w-0 max-w-83 gap-5" noValidate onSubmit={event => {
      event.preventDefault();
      if (!value) { setError("Choose a card before continuing."); setResult(""); return; }
      setError("");
      setResult(`Selected: ${new FormData(event.currentTarget).get("card")}.`);
    }} onReset={() => { setValue(""); setError(""); setResult(""); }}>
      <Field label="Card" required error={error} help="Choose the card this agent can use.">
        <Select name="card" value={value} onValueChange={next => { setValue(next); setError(""); setResult(""); }}>
          <SelectTrigger><SelectValue placeholder="Choose a card" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="travel" description="Flights and hotels">Travel agent</SelectItem>
            <SelectItem value="operations">Operations and recurring software subscriptions</SelectItem>
            <SelectItem value="archived" disabled>Archived card (unavailable)</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Billing currency" help="The currency is set when the card is created.">
        <Select defaultValue="usd" disabled>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="usd">US dollar</SelectItem></SelectContent>
        </Select>
      </Field>
      <div className="flex gap-3"><Button type="submit">Continue</Button><Button type="reset" variant="secondary">Reset</Button></div>
      <p role="status" className="text-body-sm text-fg-muted empty:hidden">{result}</p>
    </form>
  );
}
