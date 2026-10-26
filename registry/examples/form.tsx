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
