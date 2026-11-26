# Form
react-hook-form fields laid out as the brand's get-started form: display labels, square fields, red messages.

Install: npx agentcard-ds add form
Requires: theme, label, utils
Packages: @radix-ui/react-slot, react-hook-form
Exports: Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField
Client boundary: yes
Reference: agentcard.com/get-started (.v7-gate-field, computed)


## Usage
Use for a form with validation managed by react-hook-form: wrap it in Form, render each field with FormField, and place FormLabel, FormControl (around one control), FormDescription and FormMessage inside a FormItem. For a single field without react-hook-form, use Field.
- Avoid: Red labels on invalid fields
- Avoid: Placeholders instead of labels
- Avoid: Validating on every keystroke before the first submit


## Examples
Example components: npx agentcard-ds add form button input radio-group label
Example packages: react-hook-form
[Site](https://agentcard-ds.vercel.app/preview/form/Site)

examples/form.tsx

```tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Values = { label: string; limit: string; period: string };

export function Site() {
  const form = useForm<Values>({ defaultValues: { label: "", limit: "", period: "day" } });
  const [saved, setSaved] = React.useState<string>();
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit((v) => setSaved(`${v.label}: $${v.limit} per ${v.period}`))} className="grid w-full max-w-100 gap-4">
        <FormField
          control={form.control}
          name="label"
          rules={{ required: "Name the card so you can find it later." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card name</FormLabel>
              <FormControl>
                <Input placeholder="Travel card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="limit"
          rules={{ required: "Set a limit.", validate: (v) => (Number(v) > 0 && Number(v) <= 5000) || "Use an amount between $1 and $5,000." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spending limit (USD)</FormLabel>
              <FormControl>
                <Input inputMode="decimal" placeholder="250" {...field} />
              </FormControl>
              <FormDescription>The agent cannot spend more than this.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applies</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-5">
                  {["purchase", "day", "month"].map((p) => (
                    <Label variant="control" key={p} htmlFor={`form-${p}`}>
                      <RadioGroupItem value={p} id={`form-${p}`} />
                      Per {p}
                    </Label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3 pt-1">
          <Button type="submit">Create card</Button>
          <p aria-live="polite" className="text-body-sm text-fg-muted">
            {saved ? `Created ${saved}.` : ""}
          </p>
        </div>
      </form>
    </Form>
  );
}

```

## Source

components/ui/form.tsx

```tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext, useFormState, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// A react-hook-form form laid out as the brand's get-started form (agentcard.com/get-started, .v7-gate-field): each
// FormItem is a field, its label in the 12px display face at 68 percent ink 6px above the control; fields sit 16px apart
// in the form. A FormDescription is the 14px muted line under the control; a FormMessage is the same line in red, read
// out as it appears. A field that fails keeps its label muted: only the control (aria-invalid, the red border) and the
// message turn red. Field is the simpler one-control wrapper; Form is for a whole react-hook-form form.
const Form = FormProvider;

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = { id: string };

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/** The state of the field around it: its ids for labels and messages, and react-hook-form's error, dirty and touched state. */
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
  if (!itemContext) throw new Error("useFormField should be used within <FormItem>");
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return { id, name: fieldContext.name, formItemId: `${id}-form-item`, formDescriptionId: `${id}-form-item-description`, formMessageId: `${id}-form-item-message`, ...fieldState };
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("flex min-w-0 flex-col gap-1.5", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();
  return <Label data-slot="form-label" data-error={!!error} htmlFor={formItemId} className={cn("w-fit", className)} {...props} />;
}

/** Hands the field's id, its description and message ids and aria-invalid to the one control inside it. */
function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return <Slot data-slot="form-control" id={formItemId} aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`} aria-invalid={!!error} {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();
  return <p data-slot="form-description" id={formDescriptionId} className={cn("m-0 text-body-sm leading-snug text-fg-muted", className)} {...props} />;
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;
  if (!body) return null;
  return (
    <p data-slot="form-message" id={formMessageId} role={error ? "alert" : undefined} className={cn("m-0 text-body-sm leading-snug text-danger", className)} {...props}>
      {body}
    </p>
  );
}

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField };

```
