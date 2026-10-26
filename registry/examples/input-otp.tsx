"use client";

import * as React from "react";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_DIGITS } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

export function Site() {
  const [code, setCode] = React.useState("");
  const [done, setDone] = React.useState(false);
  return (
    <div className="grid gap-2">
      <Label htmlFor="otp">Code sent to your phone</Label>
      <InputOTP id="otp" maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code} onChange={(v) => { setCode(v); setDone(false); }} onComplete={() => setDone(true)}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p aria-live="polite" className="text-body-sm text-fg-muted">
        {done ? "Code entered. Revealing the card." : "Enter the six digits to reveal the card number."}
      </p>
    </div>
  );
}

export function States() {
  return (
    <div className="grid gap-4">
      <InputOTP maxLength={4} defaultValue="1234" aria-label="Invalid code" aria-invalid>
        <InputOTPGroup>
          {[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}
        </InputOTPGroup>
      </InputOTP>
      <InputOTP maxLength={4} aria-label="Disabled code" disabled>
        <InputOTPGroup>
          {[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
