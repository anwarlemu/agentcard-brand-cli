"use client";

import * as React from "react";
import { Check, Copy, Search } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

export function Site() {
  return (
    <div className="grid w-full max-w-100 gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="ig-limit">Monthly limit</Label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-limit" inputMode="decimal" defaultValue="500" />
          <InputGroupAddon align="inline-end" variant="segment">
            USD
          </InputGroupAddon>
        </InputGroup>
      </div>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search merchants" placeholder="Search merchants" />
      </InputGroup>
    </div>
  );
}

export function WithButton() {
  const key = "ac_live_4f9b2c71e8";
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="grid w-full max-w-100 gap-1.5">
      <Label htmlFor="ig-key">API key</Label>
      <InputGroup>
        <InputGroupInput id="ig-key" readOnly value={key} className="font-mono text-body-sm" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(key).then(() => setCopied(true), () => undefined)}
            aria-label={copied ? "Copied" : "Copy API key"}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export function Textarea() {
  return (
    <div className="grid w-full max-w-100 gap-1.5">
      <Label htmlFor="ig-brief">Instructions for the agent</Label>
      <InputGroup>
        <InputGroupTextarea id="ig-brief" placeholder="Book the cheapest refundable flight to Lisbon." />
        <InputGroupAddon align="block-end" className="justify-between">
          <InputGroupText>Under $400</InputGroupText>
          <InputGroupButton variant="primary">Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-100 gap-4">
      <InputGroup>
        <InputGroupInput aria-label="Card label" defaultValue="Travel card" aria-invalid />
        <InputGroupAddon align="inline-end" variant="segment">
          Taken
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Disabled" placeholder="Disabled" disabled />
      </InputGroup>
    </div>
  );
}
