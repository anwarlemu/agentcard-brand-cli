---
name: input-otp
title: Input OTP
type: ui
surface: site
description: "Joined square slots in the brand's field for a one-time code, the active slot outlined in blue."
use_for: "Use for a short code sent by SMS or email (sign-in, a card reveal). Set maxLength and pattern={REGEXP_ONLY_DIGITS}, group the slots with InputOTPGroup and split long codes with InputOTPSeparator. Paste and SMS autofill fill every slot."
never: [Rounded slots, Auto-submitting without showing the code, More than eight slots]
source: "Extrapolated from agentcard.com/get-started (.v7-gate-field input)"
---
