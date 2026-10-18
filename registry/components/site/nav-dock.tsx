"use client";

import * as React from "react";

import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

// The floating glass dock (agentcard.sh, .v7-dock-nav): a squarish bar of dark glass centered at the foot of the
// screen, over any ground. Its links are bare labels that wash on hover; the current one is the white key with blue
// text. A menu entry carries an arrow and opens a card of the same glass above the bar (its items with a line each),
// popping from its trigger; hover opens it with a mouse, a click or Enter opens it anywhere, Escape, a click outside or a
// plain link folds it. Get started is its own pane 6px past the bar's right edge (the pair is centered together): the blue key with an arrow. The dock
// fades and rises in once the page is up (240ms, ease-out; only the fade with reduced motion).
//
// On a phone (under 768px) the dock gives way to a bar of the same glass across the top: the mark, an optional line in
// the middle (the backing), and a menu button that drops a sheet of every link and the key.

type DockLink = { label: string; href: string; current?: boolean };
type DockMenuItem = { title: string; description?: React.ReactNode; href: string };
type DockMenu = { label: string; items: DockMenuItem[]; current?: boolean };
type DockEntry = DockLink | DockMenu;

const isMenu = (entry: DockEntry): entry is DockMenu => "items" in entry;

// The glass every pane of the dock is made of.
const GLASS = "border border-line-on-brand bg-glass bg-(image:--ds-glass-sheen) text-white shadow-floating [backdrop-filter:var(--ds-glass-blur)]";
// A label in the bar.
const ITEM =
  "flex items-center gap-2 rounded-menu px-3.5 py-2.25 font-display text-body-sm leading-none whitespace-nowrap outline-none transition-[background-color,color,scale] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-96 motion-reduce:active:scale-100";
const HOVER_GRACE = 220;

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4.5 fill-none stroke-current [stroke-linecap:square] [stroke-linejoin:miter] [stroke-width:2.4]", className)}>
      <path d="M8 16 16 8M9.5 8H16v6.5" />
    </svg>
  );
}

type NavDockProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The bar's entries, in order. An entry with items is a menu. */
  links: DockEntry[];
  /** A menu, placed after the first link (as Products sits after Home). The same as a menu entry in `links`. */
  menu?: DockMenu;
  /** The blue key beside the bar. */
  action?: { label: string; href: string };
  /** The phone bar's logo (defaults to the mark in white) and where it leads. */
  logo?: React.ReactNode;
  logoHref?: string;
  logoLabel?: string;
  /** A short line in the middle of the phone bar (the backing). */
  center?: React.ReactNode;
  /** The id of an element (the footer) at whose arrival the dock sinks away, so it reads whole. */
  hideAt?: string;
  /** The landmark's name. */
  label?: string;
  /** A menu to show open from the start (for docs and previews). */
  defaultOpen?: string;
};

function NavDock({ links, menu, action, logo, logoHref = "/", logoLabel = "Agentcard, home", center, hideAt, label = "Main", defaultOpen, className, ...props }: NavDockProps) {
  const entries = React.useMemo(() => (menu ? [...links.slice(0, 1), menu, ...links.slice(1)] : links), [links, menu]);
  const menus = entries.filter(isMenu);

  const [shown, setShown] = React.useState(false);
  const [atFoot, setAtFoot] = React.useState(false);
  const [open, setOpen] = React.useState<string | null>(defaultOpen ?? null);
  const [origin, setOrigin] = React.useState("50% 100%");
  const hostRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const headRef = React.useRef<HTMLButtonElement>(null);
  const triggers = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const returnTo = React.useRef<string | null>(null);
  const byHover = React.useRef(false);
  const leaveTimer = React.useRef(0);
  const cardId = React.useId();

  // Rise in on the first frame, so the entrance transition plays.
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setShown(true);
      if (defaultOpen) aim(defaultOpen);
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step aside for the footer (or whatever `hideAt` names) once its top edge is on screen.
  React.useEffect(() => {
    const target = hideAt ? document.getElementById(hideAt) : null;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      const below = entry.isIntersecting || entry.boundingClientRect.top < 0;
      setAtFoot(below);
      if (below) setOpen(null);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideAt]);

  const cancelLeave = () => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = 0;
  };
  React.useEffect(() => cancelLeave, []);

  // The card pops from its trigger: its transform origin sits under the trigger's middle.
  const aim = (name: string) => {
    const trigger = triggers.current[name];
    const host = barRef.current;
    if (!trigger || !host) return;
    const a = trigger.getBoundingClientRect();
    const b = host.getBoundingClientRect();
    setOrigin(`${Math.round(a.left + a.width / 2 - b.left)}px 100%`);
  };
  const hoverOpen = (name: string) => {
    cancelLeave();
    byHover.current = true;
    aim(name);
    setOpen(name);
  };
  const hoverClose = () => {
    if (byHover.current) setOpen(null);
  };
  const clickOpen = (name: string) => {
    cancelLeave();
    byHover.current = false;
    aim(name);
    setOpen((now) => (now === name ? null : name));
  };
  const onHostLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !byHover.current) return;
    cancelLeave();
    leaveTimer.current = window.setTimeout(() => setOpen(null), HOVER_GRACE);
  };
  const close = (restoreFocus: boolean) => {
    if (restoreFocus) returnTo.current = open;
    cancelLeave();
    setOpen(null);
  };

  // Focus follows the card: into its head when opened by click or key, back to the trigger when closed that way.
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (open) {
      if (!byHover.current) headRef.current?.focus({ preventScroll: true });
    } else if (returnTo.current) {
      triggers.current[returnTo.current]?.focus({ preventScroll: true });
      returnTo.current = null;
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        returnTo.current = open;
        setOpen(null);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!hostRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const visible = shown && !atFoot;
  const openMenu = menus.find((m) => m.label === open);
  const enter = "transition-[opacity,translate] duration-240 ease-out motion-reduce:translate-y-0 motion-reduce:transition-opacity";
  const hidden = visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0";

  return (
    <>
      <MobileBar entries={entries} action={action} logo={logo} logoHref={logoHref} logoLabel={logoLabel} center={center} label={label} />
      <div
        ref={hostRef}
        data-slot="nav-dock"
        className={cn("fixed bottom-5 left-1/2 z-90 flex -translate-x-1/2 items-end gap-1.5 max-md:hidden", className)}
        onPointerEnter={cancelLeave}
        onPointerLeave={onHostLeave}
        {...props}
      >
        <div ref={barRef} className="relative">
          {openMenu && (
            // The wrap pads the gap under the card, so a mouse crossing from the bar never leaves the dock.
            <div className="absolute inset-x-0 bottom-full pb-2">
              <div id={cardId} className={cn("w-full animate-pop-in rounded-control p-1 font-display text-caption motion-reduce:animate-fade-in", GLASS)} style={{ transformOrigin: origin }}>
                <button
                  ref={headRef}
                  type="button"
                  aria-expanded="true"
                  aria-controls={cardId}
                  onClick={() => close(true)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-menu px-2.75 pt-2.25 pb-3.25 text-body-sm leading-none outline-none focus-visible:outline-2 focus-visible:outline-white"
                >
                  {openMenu.label}
                  <span aria-hidden className="text-micro leading-none opacity-80">
                    ↑
                  </span>
                </button>
                <ul className="grid gap-0.5">
                  {openMenu.items.map((item) => (
                    <li key={item.href + item.title}>
                      <a
                        href={item.href}
                        onClick={() => close(false)}
                        className="group/item grid gap-1.5 rounded-sm px-2.75 py-3 outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-wash-glass-hover hover:shadow-glass-hover focus-visible:outline-2 focus-visible:outline-white"
                      >
                        <span className="leading-none">{item.title}</span>
                        {item.description && (
                          <span className="font-sans text-body-sm [line-height:1.45] opacity-78 transition-opacity duration-150 ease-out group-hover/item:opacity-100">{item.description}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <nav aria-label={label} inert={!visible} className={cn("rounded-control p-0.75 font-display text-caption", GLASS, enter, hidden)}>
            <div className="flex w-max gap-0.5">
              {entries.map((entry) =>
                isMenu(entry) ? (
                  <button
                    key={entry.label}
                    ref={(el) => {
                      triggers.current[entry.label] = el;
                    }}
                    type="button"
                    aria-expanded={open === entry.label}
                    aria-controls={open === entry.label ? cardId : undefined}
                    aria-current={entry.current ? "page" : undefined}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") hoverOpen(entry.label);
                    }}
                    onClick={() => clickOpen(entry.label)}
                    className={cn(
                      ITEM,
                      "cursor-pointer hover:bg-wash-on-brand aria-expanded:bg-wash-on-brand",
                      entry.current && "bg-white text-fg-brand shadow-key hover:bg-white aria-expanded:bg-white",
                    )}
                  >
                    {entry.label}
                    <span aria-hidden className="text-micro leading-none opacity-80">
                      {open === entry.label ? "↑" : "↓"}
                    </span>
                  </button>
                ) : (
                  <a
                    key={entry.href + entry.label}
                    href={entry.href}
                    aria-current={entry.current ? "page" : undefined}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") hoverClose();
                    }}
                    className={cn(ITEM, entry.current ? "bg-white text-fg-brand shadow-key" : "hover:bg-wash-on-brand")}
                  >
                    {entry.label}
                  </a>
                ),
              )}
            </div>
          </nav>
        </div>
        {action && (
          <div inert={!visible} className={cn("rounded-control p-0.75", GLASS, enter, hidden)}>
            <a
              href={action.href}
              className="grid h-8 grid-cols-[auto_--spacing(8)] items-center rounded-control border border-line-brand-edge bg-primary font-sans text-body-sm leading-none whitespace-nowrap text-on-primary shadow-key-brand outline-none transition-[background-color,box-shadow,translate] duration-150 ease-out hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px active:shadow-pressed motion-reduce:active:translate-y-0"
            >
              <span className="pl-3.5">{action.label}</span>
              <Arrow className="justify-self-center" />
            </a>
          </div>
        )}
      </div>
    </>
  );
}

/** The phone's top bar: the dock's glass across the top, the mark, a line, and a menu button over a sheet of links. */
function MobileBar({
  entries,
  action,
  logo,
  logoHref,
  logoLabel,
  center,
  label,
}: Pick<NavDockProps, "action" | "logo" | "center"> & { entries: DockEntry[]; logoHref: string; logoLabel: string; label: string }) {
  const [sheet, setSheet] = React.useState(false);
  const barRef = React.useRef<HTMLDivElement>(null);
  const sheetId = React.useId();

  React.useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheet(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setSheet(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [sheet]);

  const done = () => setSheet(false);
  const row = "flex min-h-11 items-center rounded-menu border border-transparent px-2.5 leading-none outline-none focus-visible:outline-2 focus-visible:outline-white";

  return (
    <div ref={barRef} data-slot="nav-dock-bar" data-open={sheet || undefined} className={cn("fixed inset-x-3.5 top-3.5 z-91 rounded-control font-display text-caption md:hidden", GLASS)}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 py-1.5 pr-1.5 pl-3.5">
        <a href={logoHref} aria-label={logoLabel} onClick={done} className="justify-self-start rounded-chip">
          {logo ?? <LogoMark label={null} tone="white" className="w-9.5" />}
        </a>
        {center ? <div className="flex items-center gap-1.25 whitespace-nowrap text-fg-on-brand-label">{center}</div> : <span />}
        <button
          type="button"
          aria-expanded={sheet}
          aria-controls={sheetId}
          aria-label={sheet ? "Close menu" : "Open menu"}
          onClick={() => setSheet((now) => !now)}
          className="relative grid size-9 cursor-pointer place-content-center gap-1.25 justify-self-end rounded-menu outline-none transition-[background-color] duration-150 ease-out after:absolute after:-inset-1 focus-visible:outline-2 focus-visible:outline-white aria-expanded:bg-wash-on-brand"
        >
          <i
            aria-hidden
            className={cn("block h-0.5 w-4.5 bg-current transition-[translate,rotate] duration-200 ease-out motion-reduce:transition-none", sheet && "translate-y-[0.21875rem] rotate-45")}
          />
          <i
            aria-hidden
            className={cn("block h-0.5 w-4.5 bg-current transition-[translate,rotate] duration-200 ease-out motion-reduce:transition-none", sheet && "-translate-y-[0.21875rem] -rotate-45")}
          />
        </button>
      </div>
      {sheet && (
        <nav id={sheetId} aria-label={label} className="grid origin-top-right animate-pop-in gap-2.5 border-t border-line-on-brand px-1.5 pt-1 pb-1.5 text-body-sm motion-reduce:animate-fade-in">
          <ul className="grid gap-0.5 pt-1.5">
            {entries.map((entry) =>
              isMenu(entry) ? (
                <li key={entry.label}>
                  <p className="px-2.5 pt-2.75 pb-1 leading-none text-fg-on-brand-label">{entry.label}</p>
                  <ul>
                    {entry.items.map((item) => (
                      <li key={item.href + item.title}>
                        <a href={item.href} onClick={done} className={cn(row, "pl-5")}>
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={entry.href + entry.label}>
                  <a href={entry.href} aria-current={entry.current ? "page" : undefined} onClick={done} className={cn(row, entry.current && "border-line-on-brand-strong")}>
                    {entry.label}
                  </a>
                </li>
              ),
            )}
          </ul>
          {action && (
            <a href={action.href} onClick={done} className={cn(row, "justify-between bg-primary px-3 text-white")}>
              {action.label}
              <Arrow />
            </a>
          )}
        </nav>
      )}
    </div>
  );
}

export { NavDock };
export type { DockLink, DockMenu, DockMenuItem, DockEntry, NavDockProps };
