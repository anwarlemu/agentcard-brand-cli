"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// A tag filter: the picked tags as small blue labels on a pale blue ground (each clears itself), then a small white key,
// Tags, that opens a searchable list on the brand's floating panel, each row ticked in blue when picked.
function TagFilter({
  tags,
  tagOptions,
  onAddTag,
  onRemoveTag,
  className,
}: {
  tags: string[];
  tagOptions: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const options = [...new Set([...tags, ...tagOptions])].filter((tag) => tag.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = new Set(tags);

  return (
    <div data-slot="tag-filter" className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onRemoveTag(tag)}
          aria-label={`Clear tag filter ${tag}`}
          className="flex h-8 items-center gap-1 rounded-sm border border-line-window bg-blue-5 pr-2 pl-2.5 font-display text-caption text-fg-brand outline-none transition-colors duration-150 ease-out hover:bg-blue-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring"
        >
          {tag}
          <X className="size-3" strokeWidth={1.75} />
        </button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label="Filter by tags"
          className="flex h-8 items-center gap-2 rounded-control border border-hairline bg-surface px-3 font-display text-caption whitespace-nowrap text-fg shadow-key outline-none transition-[background-color,box-shadow,translate] duration-150 ease-out hover:bg-sky-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed data-[state=open]:bg-sky-wash motion-reduce:transition-none motion-reduce:active:translate-y-0"
        >
          Tags
          <svg aria-hidden viewBox="0 0 10 6" className="h-1.5 w-2.5 fill-current text-fg-muted">
            <path d="M0 0h10L5 6z" />
          </svg>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={6} className="w-60 p-1">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tags"
            aria-label="Search tags"
            className="mb-1 h-9 w-full rounded-none border border-line-strong bg-surface px-2.5 text-body-sm text-fg transition-[border-color,box-shadow] duration-150 ease-out outline-none placeholder:text-fg-faint focus:border-line-brand focus:shadow-ring-hover motion-reduce:transition-none"
          />
          <ul className="max-h-64 overflow-y-auto">
            {options.length === 0 && <li className="px-2.5 py-2 text-body-sm text-fg-muted">{tagOptions.length === 0 ? "No tags yet" : "No matching tags"}</li>}
            {options.map((tag) => {
              const isSelected = selected.has(tag);
              return (
                <li key={tag}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => (isSelected ? onRemoveTag(tag) : onAddTag(tag))}
                    className={cn(
                      "flex h-9 w-full items-center gap-2.5 rounded-sm px-2.5 text-left font-display text-body-sm outline-none hover:bg-wash-hover focus-visible:bg-wash-hover",
                      isSelected ? "text-fg" : "text-fg-secondary",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{tag}</span>
                    <Check className={cn("size-3.5 shrink-0 text-fg-brand", !isSelected && "invisible")} strokeWidth={1.75} />
                  </button>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { TagFilter };
