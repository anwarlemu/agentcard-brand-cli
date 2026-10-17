---
name: field
title: Field
type: ui
surface: site
description: "A form field as on the get-started form: the label 6px above in the 12px display face at 68 percent ink, a red asterisk when required, help or an error below."
kinds: [input]
use_for: "Wrapping every input, select or textarea in a form, so each has a visible label and room for help or an error."
never: [Labels inside the field as placeholders, Bold or caps labels, Errors shown only by color]
source: "agentcard-website src/app/globals.css (.v7-gate-field); live https://www.agentcard.sh/get-started"
---

`Field` connects its label and help/error message to `Input`, `Textarea`, `TagsInput`, and `SelectTrigger`. It also shares required and invalid state. Set `htmlFor` when you give the control an explicit `id`; otherwise the field generates an ID.

Validation belongs to your form. Derive `error` from the current value and pass `undefined` when valid, as in the live example. A static error string stays visible until your form clears it. Set `required` on the `Select` root as well for native form validation. For a custom control, use `useFieldControl` to connect the same attributes.
