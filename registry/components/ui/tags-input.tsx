"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

// A tags field in the brand's form box (the get-started form, .v7-gate-field: square, a 35 percent ink border, at least
// 44px, the form's 2px blue outline on focus). Each tag is the guides' inline code chip (.v7-guide-prose code: blue text
// on the pale sky, a faint blue edge, small corners), red when invalid, with its own remove button; typed with Enter or
// a comma, removed with Backspace, and a pasted list split into tags.
function TagsInput({
  id,
  tags,
  onTagsChange,
  placeholder,
  isTagInvalid,
  bare = false,
  className,
}: {
  id?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  isTagInvalid?: (tag: string) => boolean;
  /** Drops the field's own border, for a TagsInput set inside a container that draws one. */
  bare?: boolean;
  className?: string;
}) {
  const [draft, setDraft] = React.useState("");

  function commit(value: string) {
    const tag = value.trim().replace(/,$/, "");
    if (tag && !tags.includes(tag)) onTagsChange([...tags, tag]);
    setDraft("");
  }

  return (
    <div
      data-slot="tags-input"
      className={cn(
        "flex min-h-11 w-full flex-wrap items-center gap-1.5 px-2 py-1.5",
        !bare && "rounded-none border border-line-strong bg-surface focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-solid focus-within:outline-focus-ring",
        className,
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "flex h-7 items-center gap-0.5 rounded-sm border pr-0.5 pl-2 font-display text-body-sm leading-none",
            isTagInvalid?.(tag) ? "border-danger bg-surface text-danger" : "border-line-window bg-sky-wash text-fg-brand",
          )}
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onTagsChange(tags.filter((existing) => existing !== tag))}
            className="grid size-5.5 place-items-center rounded-[calc(var(--ds-radius-sm)/2)] opacity-70 outline-none transition-[opacity,background-color] duration-150 ease-out hover:bg-wash-selected hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring motion-reduce:transition-none"
          >
            <X className="size-3" strokeWidth={1.75} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(event) => {
          if (event.target.value.endsWith(",")) commit(event.target.value);
          else setDraft(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(draft);
          }
          if (event.key === "Backspace" && !draft && tags.length > 0) onTagsChange(tags.slice(0, -1));
        }}
        onPaste={(event) => {
          const pasted = event.clipboardData
            .getData("text")
            .split(/[,\s]+/)
            .map((part) => part.trim())
            .filter(Boolean);
          if (pasted.length < 2) return;
          event.preventDefault();
          onTagsChange(Array.from(new Set([...tags, ...pasted])));
          setDraft("");
        }}
        onBlur={() => draft && commit(draft)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="h-8 min-w-24 flex-1 bg-transparent px-1.5 text-h5 leading-snug text-fg outline-none placeholder:text-fg-faint"
      />
    </div>
  );
}

export { TagsInput };
