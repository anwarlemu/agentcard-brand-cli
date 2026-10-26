# Tags input
Editable list of values with add, remove and validation states.

Install: npx agentcard-ds add tags-input
Requires: theme, field, utils
Packages: lucide-react
Exports: TagsInput
Client boundary: yes
Reference: Extension from live https://www.agentcard.sh/get-started (.v7-gate-field input); src/app/globals.css (.v7-guide-prose code)


## Usage
Use inside Field for domains, emails or similar values. Enter or comma adds a value; Backspace removes the last value when the input is empty. Provide isTagInvalid for validation.
- Avoid: Rounded fields
- Avoid: Tags without a way to remove them
- Avoid: Free text that should be a textarea


## Examples
Example components: npx agentcard-ds add tags-input field
[Site](https://agentcard-ds.vercel.app/preview/tags-input/Site)

examples/tags-input.tsx

```tsx
"use client";

import { useState } from "react";

import { Field } from "@/components/ui/field";
import { TagsInput } from "@/components/ui/tags-input";

export function Site() {
  const [tags, setTags] = useState(["delta.com", "marriott.com", "not a domain"]);
  return (
    <div className="max-w-170">
      <Field label="Allowed merchants" htmlFor="tags-merchants" help="Press Enter or a comma after each one.">
        <TagsInput id="tags-merchants" tags={tags} onTagsChange={setTags} placeholder="airline.com" isTagInvalid={(tag) => !tag.includes(".") || tag.includes(" ")} />
      </Field>
    </div>
  );
}

```

## Source

components/ui/tags-input.tsx

```tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useFieldControl } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type TagsInputProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type" | "size"> & {
  tags: string[]; onTagsChange: (tags: string[]) => void;
  isTagInvalid?: (tag: string) => boolean; bare?: boolean;
};

// Enter, comma and pasted lists commit tags. Backspace removes the last tag when the draft is empty.
function TagsInput({ tags, onTagsChange, placeholder, isTagInvalid, bare = false, className, name,
  disabled, readOnly, onKeyDown, onPaste, onBlur, ...props }: TagsInputProps) {
  const [draft, setDraft] = React.useState("");
  const control = useFieldControl(props);
  const invalid = tags.some((tag) => isTagInvalid?.(tag));
  const locked = disabled || readOnly;
  function commit(value: string) {
    if (locked) return;
    const additions = value.split(",").map((tag) => tag.trim()).filter(Boolean);
    if (additions.length) onTagsChange(Array.from(new Set([...tags, ...additions])));
    setDraft("");
  }
  return (
    <div data-slot="tags-input" data-disabled={disabled || undefined} className={cn(
      "flex min-h-11 w-full flex-wrap items-center gap-1.5 px-2 py-1.5 data-disabled:opacity-50",
      !bare && "rounded-none border border-line-strong bg-surface focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-solid focus-within:outline-focus-ring", className)}>
      {name && tags.map((tag) => <input key={tag} type="hidden" name={name} value={tag} disabled={disabled} />)}
      {tags.map((tag) => <span key={tag} className={cn(
        "flex h-7 items-center gap-0.5 rounded-sm border pr-0.5 pl-2 font-display text-body-sm leading-none",
        isTagInvalid?.(tag) ? "border-danger bg-surface text-danger" : "border-line-window bg-sky-wash text-fg-brand")}>
        {tag}
        <button type="button" disabled={locked} aria-label={`Remove ${tag}`}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => onTagsChange(tags.filter((existing) => existing !== tag))}
          className="grid size-5.5 place-items-center rounded-[calc(var(--ds-radius-sm)/2)] opacity-70 outline-none transition-[opacity,background-color] duration-150 ease-out hover:bg-wash-selected hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none motion-reduce:transition-none">
          <X className="size-3" strokeWidth={1.75} />
        </button>
      </span>)}
      <input {...control} value={draft} disabled={disabled} readOnly={readOnly}
        required={Boolean(control.required && !tags.length)}
        aria-required={control.required || undefined}
        aria-invalid={control["aria-invalid"] ?? (invalid || undefined)}
        onChange={(event) => {
          if (event.target.value.endsWith(",") && !(event.nativeEvent as InputEvent).isComposing) commit(event.target.value);
          else setDraft(event.target.value);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (locked || event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229) return;
          if (event.key === "Enter") { event.preventDefault(); commit(draft); }
          if (event.key === "Backspace" && !draft && tags.length) onTagsChange(tags.slice(0, -1));
        }}
        onPaste={(event) => {
          onPaste?.(event);
          if (locked || event.defaultPrevented) return;
          const pasted = event.clipboardData.getData("text").split(/[,\s]+/).filter(Boolean);
          if (pasted.length < 2) return;
          event.preventDefault();
          onTagsChange(Array.from(new Set([...tags, ...pasted])));
          setDraft("");
        }}
        onBlur={(event) => { onBlur?.(event); if (!event.defaultPrevented && draft) commit(draft); }}
        placeholder={tags.length ? "" : placeholder}
        className="h-8 min-w-24 flex-1 bg-transparent px-1.5 text-h5 leading-snug text-fg outline-none placeholder:text-fg-faint" />
    </div>
  );
}
export { TagsInput };

```
