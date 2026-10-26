# Combobox
A searchable choice: the square field opens the floating panel with a search row and washed rows.

Install: npx agentcard-ds add combobox
Requires: theme, surface, utils
Packages: @radix-ui/react-popover, cmdk, lucide-react
Exports: Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxClear, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue, useCombobox, useComboboxAnchor
Client boundary: yes
Reference: Extrapolated from agentcard.com/get-started (.v7-gate-field select) and agentcard-website src/components/v7/guide-search.tsx


## Usage
Use for one or several choices from a list too long to scan (merchants, agents, currencies). Compose ComboboxTrigger (or ComboboxChips for several values), ComboboxContent, ComboboxInput, ComboboxList and ComboboxItem. Give it a name to submit the chosen values.
- Avoid: A combobox for under six options (use a select)
- Avoid: Rounded triggers
- Avoid: Filtering that hides the chosen value without saying so


## Examples
Example components: npx agentcard-ds add combobox label
[Site](https://agentcard-ds.vercel.app/preview/combobox/Site) | [Multiple](https://agentcard-ds.vercel.app/preview/combobox/Multiple) | [Groups](https://agentcard-ds.vercel.app/preview/combobox/Groups) | [States](https://agentcard-ds.vercel.app/preview/combobox/States)

examples/combobox.tsx

```tsx
"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

const MERCHANTS = [
  { value: "united", label: "United Airlines" },
  { value: "delta", label: "Delta Air Lines" },
  { value: "marriott", label: "Marriott" },
  { value: "hilton", label: "Hilton" },
  { value: "figma", label: "Figma" },
  { value: "notion", label: "Notion" },
  { value: "casino", label: "Online casino", disabled: true },
];

export function Site() {
  const [merchant, setMerchant] = React.useState<string | null>("united");
  return (
    <div className="grid w-full max-w-86 gap-1.5">
      <Label id="merchant-label">Merchant</Label>
      <Combobox items={MERCHANTS} value={merchant} onValueChange={setMerchant} name="merchant">
        <ComboboxTrigger aria-labelledby="merchant-label">
          <ComboboxValue placeholder="Choose a merchant" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search merchants" />
          <ComboboxList>
            <ComboboxEmpty>No merchant with that name.</ComboboxEmpty>
            {MERCHANTS.map((m) => (
              <ComboboxItem key={m.value} value={m.value} label={m.label} disabled={m.disabled}>
                {m.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function Multiple() {
  const [values, setValues] = React.useState<string[]>(["united", "marriott"]);
  return (
    <div className="grid w-full max-w-100 gap-1.5">
      <Label htmlFor="merchants-input">Allowed merchants</Label>
      <Combobox multiple items={MERCHANTS} value={values} onValueChange={setValues}>
        <ComboboxChips>
          {values.map((v) => (
            <ComboboxChip key={v} value={v} />
          ))}
          <ComboboxChipsInput id="merchants-input" placeholder={values.length ? "" : "Add merchants"} />
          <ComboboxClear />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No merchant with that name.</ComboboxEmpty>
            {MERCHANTS.map((m) => (
              <ComboboxItem key={m.value} value={m.value} label={m.label} disabled={m.disabled} />
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function Groups() {
  return (
    <div className="grid w-full max-w-86 gap-1.5">
      <Label id="grouped-label">Merchant</Label>
      <Combobox items={MERCHANTS}>
        <ComboboxTrigger aria-labelledby="grouped-label" />
        <ComboboxContent>
          <ComboboxInput placeholder="Search merchants" />
          <ComboboxList>
            <ComboboxEmpty>No merchant with that name.</ComboboxEmpty>
            <ComboboxGroup heading="Travel">
              {MERCHANTS.slice(0, 4).map((m) => <ComboboxItem key={m.value} value={m.value} label={m.label} />)}
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup heading="Software">
              {MERCHANTS.slice(4, 6).map((m) => <ComboboxItem key={m.value} value={m.value} label={m.label} />)}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-86 gap-4">
      <Combobox items={MERCHANTS} disabled>
        <ComboboxTrigger aria-label="Disabled merchant" />
      </Combobox>
      <Combobox items={MERCHANTS}>
        <ComboboxTrigger aria-label="Invalid merchant" aria-invalid>
          <ComboboxValue placeholder="Choose a merchant" />
        </ComboboxTrigger>
      </Combobox>
    </div>
  );
}

```

## Source

components/ui/combobox.tsx

```tsx
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, X } from "lucide-react";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A searchable choice in the brand's form (extrapolated from agentcard.com/get-started, .v7-gate-field select, and the
// guides' search palette, .v7-guide-search). The trigger is the field's square box, 35 percent ink border and 18px Inter
// with the select's small ink triangle; focus and an open list draw the form's 2px blue outline just inside it. It opens
// the brand's floating panel (white, a hairline, 8px corners, the tooltip shadow) growing from the trigger: a search row
// with the palette's blue mark over its 2px dotted rule, then rows in the 14px display face at 80 percent ink; the
// highlighted row takes the guides' sky wash, a chosen row a blue tick, and groups are headed in the 12px display face in
// blue. For several values, ComboboxChips is the field itself: pale chips in the 12px display face with an x, and a text
// input that filters as you type (Backspace on an empty input removes the last chip). Moving through the rows is
// instant: it is done by keyboard.

function SearchMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn("size-3.75 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-width:1.5]", className)}>
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

type Item = { value: string; label: string; disabled?: boolean };

type ComboboxContextValue = {
  multiple: boolean;
  values: string[];
  toggle: (value: string) => void;
  remove: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  labelOf: (value: string) => string;
  register: (value: string, label: string) => void;
  items?: Item[];
  disabled?: boolean;
  listRef: React.RefObject<HTMLDivElement | null>;
  chipsRef: React.RefObject<HTMLDivElement | null>;
  chips: boolean;
  setChips: (chips: boolean) => void;
  contentId: string;
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("Combobox parts must be used within <Combobox>");
  return context;
}

type ComboboxBaseProps = {
  /** The choices, for labels while the list is closed and for ComboboxList's render function. */
  items?: (Item | string)[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** The submitted name: one hidden input per chosen value. */
  name?: string;
  children?: React.ReactNode;
};

type ComboboxSingleProps = ComboboxBaseProps & { multiple?: false; value?: string | null; defaultValue?: string | null; onValueChange?: (value: string | null) => void };
type ComboboxMultipleProps = ComboboxBaseProps & { multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void };

const normalize = (items?: (Item | string)[]) => items?.map((i) => (typeof i === "string" ? { value: i, label: i } : i));

function Combobox(props: ComboboxSingleProps | ComboboxMultipleProps) {
  const { open: openProp, defaultOpen = false, onOpenChange, disabled, name, children } = props;
  const multiple = props.multiple === true;
  const items = React.useMemo(() => normalize(props.items), [props.items]);
  const initial = props.defaultValue == null ? [] : Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  const [inner, setInner] = React.useState<string[]>(initial);
  const controlled = props.value !== undefined;
  const values = controlled ? (props.value == null ? [] : Array.isArray(props.value) ? props.value : [props.value]) : inner;
  const [openInner, setOpenInner] = React.useState(defaultOpen);
  const open = openProp ?? openInner;
  const [search, setSearch] = React.useState("");
  const [chips, setChips] = React.useState(false);
  const labels = React.useRef(new Map<string, string>());
  const listRef = React.useRef<HTMLDivElement>(null);
  const chipsRef = React.useRef<HTMLDivElement>(null);
  const contentId = React.useId();

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInner(next);
      onOpenChange?.(next);
      if (!next) setSearch("");
    },
    [openProp, onOpenChange],
  );
  const commit = (next: string[]) => {
    if (!controlled) setInner(next);
    if (multiple) (props as ComboboxMultipleProps).onValueChange?.(next);
    else (props as ComboboxSingleProps).onValueChange?.(next[0] ?? null);
  };
  const toggle = (value: string) => {
    if (multiple) {
      commit(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
      setSearch("");
    } else {
      // Picking the chosen value again keeps it; ComboboxClear empties the field.
      commit([value]);
      setOpen(false);
    }
  };
  const remove = (value: string) => commit(values.filter((v) => v !== value));
  const labelOf = (value: string) => labels.current.get(value) ?? items?.find((i) => i.value === value)?.label ?? value;
  const register = React.useCallback((value: string, label: string) => labels.current.set(value, label), []);

  return (
    <ComboboxContext.Provider value={{ multiple, values, toggle, remove, open, setOpen, search, setSearch, labelOf, register, items, disabled, listRef, chipsRef, chips, setChips, contentId }}>
      <PopoverPrimitive.Root data-slot="combobox" open={open} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive.Root>
      {name && values.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
    </ComboboxContext.Provider>
  );
}

const FIELD =
  "flex min-h-11 w-full min-w-0 items-center gap-3 rounded-none border border-line-strong bg-surface pr-3.25 pl-3 font-sans text-h5 leading-snug text-fg outline-none aria-invalid:border-danger";

/** The closed field: the chosen value (ComboboxValue) and the caret. Opens the list. */
function ComboboxTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  const { open, disabled, values, contentId } = useCombobox();
  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={contentId}
        data-slot="combobox-trigger"
        data-empty={!values.length}
        disabled={disabled}
        className={cn(FIELD, "cursor-pointer py-2.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring data-[state=open]:outline-2 data-[state=open]:-outline-offset-1 data-[state=open]:outline-solid data-[state=open]:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[empty=true]:text-fg-faint", className)}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate">{children ?? <ComboboxValue />}</span>
        <svg aria-hidden viewBox="0 0 10 5" className="h-1.25 w-2.5 shrink-0 fill-current text-fg">
          <path d="M0 0h10L5 5z" />
        </svg>
      </button>
    </PopoverPrimitive.Trigger>
  );
}

/** The chosen value's label, the chosen labels joined, or the placeholder. */
function ComboboxValue({ placeholder = "Select", children }: { placeholder?: string; children?: (values: string[]) => React.ReactNode }) {
  const { values, labelOf } = useCombobox();
  if (children) return <>{children(values)}</>;
  return <span data-slot="combobox-value">{values.length ? values.map(labelOf).join(", ") : placeholder}</span>;
}

/** Clears every chosen value. Put it inside ComboboxChips or beside a trigger. */
function ComboboxClear({ className, ...props }: React.ComponentProps<"button">) {
  const { values, remove, disabled } = useCombobox();
  if (!values.length) return null;
  return (
    <button
      type="button"
      data-slot="combobox-clear"
      aria-label="Clear"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        values.forEach(remove);
      }}
      className={cn("inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-fg-faint outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring motion-reduce:transition-none", className)}
      {...props}
    >
      <X className="size-4" strokeWidth={1.75} />
    </button>
  );
}

function ComboboxContent({ className, children, align = "start", sideOffset = 6, anchor, onInteractOutside, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content> & { anchor?: React.RefObject<HTMLElement | null> }) {
  const container = usePortalContainer();
  const { search, chips, listRef, chipsRef, contentId, open } = useCombobox();
  // With chips cmdk does not filter, so it would keep a hidden row highlighted: highlight the first match instead.
  const [active, setActive] = React.useState("");
  React.useEffect(() => {
    if (!chips || !open) return;
    const frame = requestAnimationFrame(() => setActive(listRef.current?.querySelector("[cmdk-item]:not([data-disabled=true])")?.getAttribute("data-value") ?? ""));
    return () => cancelAnimationFrame(frame);
  }, [chips, open, search, listRef]);
  return (
    <>
    {anchor && <PopoverPrimitive.Anchor virtualRef={anchor as React.RefObject<HTMLElement>} />}
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        id={contentId}
        data-slot="combobox-content"
        align={align}
        sideOffset={sideOffset}
        // With chips the typing stays in the field; the list follows it.
        onOpenAutoFocus={chips ? (e) => e.preventDefault() : undefined}
        onInteractOutside={(e) => {
          onInteractOutside?.(e);
          // A press in the chips field keeps the list open: the field is where the typing happens.
          if (chips && chipsRef.current?.contains(e.target as Node)) e.preventDefault();
        }}
        className={cn(
          "z-50 w-(--radix-popover-trigger-width) min-w-56 max-w-[calc(100vw-2rem)] origin-(--radix-popover-content-transform-origin) animate-pop-in overflow-hidden rounded-control border border-hairline bg-surface text-fg shadow-tooltip outline-none motion-reduce:animate-none",
          className,
        )}
        {...props}
      >
        <CommandPrimitive ref={listRef} shouldFilter={!chips} {...(chips ? { value: active, onValueChange: setActive } : {})} className="flex flex-col">
          {children}
        </CommandPrimitive>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
    </>
  );
}

/** The search row at the top of the list. */
function ComboboxInput({ className, placeholder = "Search", ...props }: Omit<React.ComponentProps<typeof CommandPrimitive.Input>, "value" | "onValueChange">) {
  const { search, setSearch } = useCombobox();
  return (
    <div data-slot="combobox-input-wrapper" className="flex h-11 shrink-0 items-center gap-2.5 border-b-2 border-dotted border-line-mid px-3.5 text-fg-brand">
      <SearchMark />
      <CommandPrimitive.Input
        data-slot="combobox-input"
        value={search}
        onValueChange={setSearch}
        placeholder={placeholder}
        className={cn("h-full w-full min-w-0 bg-transparent font-display text-body leading-tight text-fg caret-primary outline-none placeholder:text-fg-faint", className)}
        {...props}
      />
    </div>
  );
}

/** The rows. Pass items as children, or a function that renders each of the Combobox's items. */
function ComboboxList({ className, children, ...props }: Omit<React.ComponentProps<typeof CommandPrimitive.List>, "children"> & { children?: React.ReactNode | ((item: Item) => React.ReactNode) }) {
  const { items } = useCombobox();
  return (
    <CommandPrimitive.List data-slot="combobox-list" className={cn("max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain p-1 [scrollbar-color:var(--ds-color-border-default)_transparent] [scrollbar-width:thin]", className)} {...props}>
      {typeof children === "function" ? items?.map((item) => <React.Fragment key={item.value}>{children(item)}</React.Fragment>) : children}
    </CommandPrimitive.List>
  );
}

/** Renders a group's own items with a function, inside a ComboboxGroup. */
function ComboboxCollection({ items, children }: { items: (Item | string)[]; children: (item: Item) => React.ReactNode }) {
  return <>{normalize(items)?.map((item) => <React.Fragment key={item.value}>{children(item)}</React.Fragment>)}</>;
}

function ComboboxItem({ value, label, className, children, disabled, ...props }: Omit<React.ComponentProps<typeof CommandPrimitive.Item>, "value" | "onSelect"> & { value: string; label?: string }) {
  const { values, toggle, register, chips, search } = useCombobox();
  const text = label ?? (typeof children === "string" ? children : value);
  React.useEffect(() => {
    register(value, text);
  }, [register, value, text]);
  // With chips, cmdk does not filter (the typing is outside it): hide rows that do not match here.
  if (chips && search && !text.toLowerCase().includes(search.toLowerCase())) return null;
  const selected = values.includes(value);
  return (
    <CommandPrimitive.Item
      data-slot="combobox-item"
      data-item-value={value}
      value={`${text} ${value}`}
      disabled={disabled}
      data-checked={selected || undefined}
      onSelect={() => toggle(value)}
      className={cn(
        "relative flex min-h-9 cursor-default items-center gap-2.5 rounded-sm py-2 pr-8 pl-2.5 font-display text-body-sm leading-snug text-fg-secondary outline-none select-none data-[checked=true]:text-fg data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 data-[selected=true]:bg-search-selected data-[selected=true]:text-fg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-fg-brand",
        className,
      )}
      {...props}
    >
      {children ?? text}
      {selected && <Check aria-hidden strokeWidth={1.75} className="absolute right-2.5 size-3.5 text-fg-brand" />}
    </CommandPrimitive.Item>
  );
}

function ComboboxEmpty({ className, children = "No results.", ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  const { chips, search, items, labelOf, values } = useCombobox();
  // cmdk's own empty state only knows its filter; with chips, decide here.
  if (chips) {
    const any = (items ?? values.map((v) => ({ value: v, label: labelOf(v) }))).some((i) => !search || i.label.toLowerCase().includes(search.toLowerCase()));
    if (any) return null;
    return (
      <div data-slot="combobox-empty" className={cn("px-3.5 py-4.5 font-display text-body-sm text-fg-muted", className)}>
        {children}
      </div>
    );
  }
  return (
    <CommandPrimitive.Empty data-slot="combobox-empty" className={cn("px-3.5 py-4.5 font-display text-body-sm text-fg-muted", className)} {...props}>
      {children}
    </CommandPrimitive.Empty>
  );
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="combobox-group"
      className={cn("overflow-hidden text-fg [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:leading-body [&_[cmdk-group-heading]]:text-fg-brand", className)}
      {...props}
    />
  );
}

/** A heading inside the list that is not a group's (a note above the rows). */
function ComboboxLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-label" className={cn("px-2.5 pt-2.5 pb-1 font-display text-caption leading-body text-fg-muted", className)} {...props} />;
}

function ComboboxSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="combobox-separator" className={cn("-mx-1 my-1 border-t-2 border-dotted border-hairline", className)} {...props} />;
}

/** The field for several values: chips and a text input, anchoring the list. */
function ComboboxChips({ className, children, ...props }: React.ComponentProps<"div">) {
  const { setChips, setOpen, disabled, chipsRef } = useCombobox();
  React.useEffect(() => {
    setChips(true);
    return () => setChips(false);
  }, [setChips]);
  return (
    <PopoverPrimitive.Anchor asChild>
      <div
        ref={chipsRef}
        data-slot="combobox-chips"
        data-disabled={disabled || undefined}
        onMouseDown={(e) => {
          if (disabled || e.target !== e.currentTarget) return;
          e.preventDefault();
          e.currentTarget.querySelector("input")?.focus();
          setOpen(true);
        }}
        className={cn(FIELD, "flex-wrap gap-1.5 py-2 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:-outline-offset-1 has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-focus-ring data-disabled:opacity-50", className)}
        {...props}
      >
        {children}
      </div>
    </PopoverPrimitive.Anchor>
  );
}

function ComboboxChip({ value, className, children, ...props }: React.ComponentProps<"span"> & { value: string }) {
  const { remove, labelOf, disabled } = useCombobox();
  return (
    <span data-slot="combobox-chip" className={cn("inline-flex h-7 max-w-full items-center gap-1 rounded-sm bg-wash-pill pr-1 pl-2.5 font-display text-caption leading-none text-fg", className)} {...props}>
      <span className="truncate">{children ?? labelOf(value)}</span>
      <button
        type="button"
        aria-label={`Remove ${labelOf(value)}`}
        disabled={disabled}
        onClick={() => remove(value)}
        className="inline-flex size-5 items-center justify-center rounded-chip text-fg-muted outline-none transition-colors duration-150 ease-out hover:bg-wash-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring motion-reduce:transition-none"
      >
        <X className="size-3.5" strokeWidth={1.75} />
      </button>
    </span>
  );
}

/** The typing part of ComboboxChips: filters the list; arrows and Enter work the list; Backspace removes the last chip. */
function ComboboxChipsInput({ className, onKeyDown, ...props }: React.ComponentProps<"input">) {
  const { search, setSearch, setOpen, open, values, remove, toggle, listRef, disabled, contentId } = useCombobox();
  return (
    <input
      data-slot="combobox-chips-input"
      role="combobox"
      aria-expanded={open}
      aria-controls={contentId}
      aria-autocomplete="list"
      disabled={disabled}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        if (!open) setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "Backspace" && !search && values.length) remove(values[values.length - 1]);
        else if (["ArrowDown", "ArrowUp", "Enter", "Home", "End"].includes(e.key) && open && listRef.current) {
          e.preventDefault();
          // The highlight follows the typing a frame later: an Enter before it lands picks the first match.
          if (e.key === "Enter" && !listRef.current.querySelector("[cmdk-item][data-selected=true]")) {
            const first = listRef.current.querySelector<HTMLElement>("[cmdk-item]:not([data-disabled=true])")?.dataset.itemValue;
            if (first) toggle(first);
            return;
          }
          // Hand the key to the list, which moves the highlight or picks the highlighted row.
          listRef.current.dispatchEvent(new KeyboardEvent("keydown", { key: e.key, bubbles: true, cancelable: true }));
        } else if (e.key === "ArrowDown" && !open) setOpen(true);
      }}
      className={cn("h-7 min-w-24 flex-1 bg-transparent font-sans text-h5 leading-snug text-fg outline-none placeholder:text-fg-faint disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

/** A ref for an element the list should open from, when it is not the trigger (pass it to ComboboxContent's anchor). */
function useComboboxAnchor<T extends HTMLElement = HTMLDivElement>() {
  return React.useRef<T>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useCombobox,
  useComboboxAnchor,
};

```
