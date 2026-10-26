# Sidebar
An app's side rail drawn as the guides' panel: quiet 14px rows, the current one on the sky wash in blue.

Install: npx agentcard-ds add sidebar
Requires: theme, button, input, separator, sheet, skeleton, tooltip, utils
Packages: @radix-ui/react-slot, class-variance-authority, lucide-react
Exports: Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar
Client boundary: yes
Reference: agentcard-website guides panel (.v7-guide-nav), extrapolated to an app rail


## Usage
Use for an app's main navigation (agents, cards, purchases, settings). Wrap the app in SidebarProvider, put Sidebar beside SidebarInset, group rows in SidebarGroup with a label, and mark the current page with isActive. Use collapsible icon to fold it to its glyphs; it becomes a sheet on phones.
- Avoid: Blue filled rows
- Avoid: More than two levels of nesting
- Avoid: Icons that move on hover


## Examples
Example components: npx agentcard-ds add sidebar avatar logo
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/sidebar/Site) | [Icons](https://agentcard-ds.vercel.app/preview/sidebar/Icons) | [Floating](https://agentcard-ds.vercel.app/preview/sidebar/Floating) | [Loading](https://agentcard-ds.vercel.app/preview/sidebar/Loading)

examples/sidebar.tsx

```tsx
"use client";

import * as React from "react";
import { Bot, ChevronsUpDown, CircleHelp, CreditCard, KeyRound, LayoutGrid, PanelLeft, Plus, Receipt, Settings, ShieldCheck, Store, type LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lockup } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type Row = { title: string; icon: LucideIcon; badge?: string };

const MAIN: Row[] = [
  { title: "Overview", icon: LayoutGrid },
  { title: "Agents", icon: Bot, badge: "4" },
  { title: "Cards", icon: CreditCard },
  { title: "Purchases", icon: Receipt, badge: "12" },
];
const CONTROLS: Row[] = [
  { title: "Merchants", icon: Store },
  { title: "Approvals", icon: ShieldCheck },
  { title: "API keys", icon: KeyRound },
];

function Rows({ rows, current, onSelect }: { rows: Row[]; current: string; onSelect: (title: string) => void }) {
  return (
    <SidebarMenu>
      {rows.map(({ title, icon: Icon, badge }) => (
        <SidebarMenuItem key={title}>
          <SidebarMenuButton isActive={current === title} tooltip={title} onClick={() => onSelect(title)}>
            <Icon strokeWidth={1.5} />
            <span>{title}</span>
          </SidebarMenuButton>
          {badge && <SidebarMenuBadge variant="count">{badge}</SidebarMenuBadge>}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function CollapseRow() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip="Expand" onClick={toggleSidebar} aria-expanded={state === "expanded"}>
        <PanelLeft strokeWidth={1.5} />
        <span>{state === "expanded" ? "Collapse" : "Expand"}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AppRail({ collapsible = "offcanvas", variant = "sidebar" }: { collapsible?: "offcanvas" | "icon" | "none"; variant?: "sidebar" | "secondary" | "floating" | "inset" }) {
  const [current, setCurrent] = React.useState("Agents");
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <a href="#overview" className="w-fit rounded-chip px-2.5 outline-none group-data-[collapsible=icon]/sidebar:hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring">
          <Lockup className="w-32" />
        </a>
        <SidebarInput placeholder="Search" aria-label="Search" className="group-data-[collapsible=icon]/sidebar:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Rows rows={MAIN} current={current} onSelect={setCurrent} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Controls</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add a control">
            <Plus strokeWidth={1.75} />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <Rows rows={CONTROLS} current={current} onSelect={setCurrent} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Workspace" isActive={current === "Workspace"} onClick={() => setCurrent("Workspace")}>
                  <Settings strokeWidth={1.5} />
                  <span>Workspace</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {["Members", "Billing", "Webhooks"].map((title) => (
                    <SidebarMenuSubItem key={title}>
                      <SidebarMenuSubButton href={`#${title.toLowerCase()}`} isActive={current === title} onClick={(e) => { e.preventDefault(); setCurrent(title); }}>
                        <span>{title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <CircleHelp strokeWidth={1.5} />
              <span>Help</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>New</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dana Ortiz" aria-haspopup="menu">
              <Avatar className="size-4.5">
                <AvatarFallback className="text-micro">D</AvatarFallback>
              </Avatar>
              <span className="flex-1">Dana Ortiz</span>
              <ChevronsUpDown strokeWidth={1.5} className="size-3.5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          {collapsible === "icon" && <CollapseRow />}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function PageHead({ title, description }: { title: string; description: string }) {
  return (
    <header className="flex items-start gap-3 border-b border-line px-6 py-5">
      <SidebarTrigger className="-ml-2 md:hidden" />
      <div className="grid gap-1">
        <h1 className="font-display text-h4 leading-display font-medium tracking-tight text-fg">{title}</h1>
        <p className="text-body-sm text-fg-muted">{description}</p>
      </div>
    </header>
  );
}

export function Site() {
  return (
    <SidebarProvider className="h-170 min-h-0 overflow-hidden rounded-card border border-hairline">
      <AppRail />
      <SidebarInset>
        <PageHead title="Agents" description="Four agents can buy with cards you issue them." />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Icons() {
  return (
    <SidebarProvider defaultOpen={false} className="h-170 min-h-0 overflow-hidden rounded-card border border-hairline">
      <AppRail collapsible="icon" />
      <SidebarInset>
        <PageHead title="Cards" description="Press Cmd B, or Collapse, to switch between the full rail and its glyphs." />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Floating() {
  return (
    <SidebarProvider className="h-170 min-h-0 overflow-hidden rounded-card border border-hairline bg-paper">
      <AppRail variant="floating" />
      <SidebarInset className="bg-paper">
        <PageHead title="Purchases" description="Every checkout your agents made this month." />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Loading() {
  return (
    <SidebarProvider className="h-100 min-h-0 overflow-hidden rounded-card border border-hairline">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <Lockup className="w-32 px-2.5" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Agents</SidebarGroupLabel>
            <SidebarMenu>
              {Array.from({ length: 5 }, (_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <PageHead title="Agents" description="Loading your agents." />
      </SidebarInset>
    </SidebarProvider>
  );
}

```

## Source

components/ui/sidebar.tsx

```tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// An app's side rail, drawn as the brand's guides' panel (agentcard-website, .v7-guide-nav): white with a 16 percent
// ink hairline at its edge; rows are 14px Inter at 68 percent ink in 8px-cornered rows (10px in) with a 16px glyph and a
// 4 percent ink wash under the pointer; the current row is the pale sky wash with blue text at 500. Group labels are the
// 14px display face at 500 in ink, labeled groups ruled apart by a 14 percent ink line. `secondary` sits on the warm
// paper with the current row in white; `floating` is the brand's window panel (a hairline, 12px corners, the guide
// shadow) 8px from the edges; `inset` sets the page beside it as a raised white panel. Collapsing to icons narrows the
// rail to its glyphs (200ms ease-out); the keyboard shortcut toggles it instantly. On a phone it opens in the sheet.
const SIDEBAR_WIDTH = "calc(var(--ds-space-32) * 2 + var(--ds-space-6))";
const SIDEBAR_WIDTH_ICON = "calc(var(--ds-space-8) + var(--ds-space-5) + 1px)";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const MOBILE_QUERY = "(max-width: 767px)";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isMobile;
}

/**
 * Holds whether the rail is open (expanded or collapsed on a desktop, shown in a sheet on a phone). Uncontrolled with
 * `defaultOpen`, or controlled with `open` and `onOpenChange`. Nothing is stored: keep the state yourself if it should
 * survive a reload. Cmd or Ctrl and B toggles it.
 */
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }: React.ComponentProps<"div"> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value;
      if (setOpenProp) setOpenProp(next);
      else setInternalOpen(next);
    },
    [setOpenProp, open],
  );
  const toggleSidebar = React.useCallback(() => {
    setInstant(false);
    return isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o);
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    // A shortcut is pressed many times a day: it changes the rail at once, with no motion.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== SIDEBAR_KEYBOARD_SHORTCUT || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setInstant(true);
      if (isMobile) setOpenMobile((o) => !o);
      else setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobile, setOpen]);

  const state = open ? "expanded" : "collapsed";
  const value = React.useMemo<SidebarContextProps>(() => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }), [state, open, setOpen, isMobile, openMobile, toggleSidebar]);

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          data-instant={instant || undefined}
          style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style } as React.CSSProperties}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-paper", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/**
 * The rail. `variant`: sidebar (the white rail), secondary (on the warm paper), floating (the brand's window panel,
 * 8px from the edges) or inset (the rail on the paper with the page as a raised white panel beside it).
 * `collapsible`: offcanvas (slides away), icon (narrows to its glyphs) or none.
 */
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { side?: "left" | "right"; variant?: "sidebar" | "secondary" | "floating" | "inset"; collapsible?: "offcanvas" | "icon" | "none" }) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const ground = variant === "secondary" || variant === "inset" ? "bg-paper" : "bg-surface";

  if (collapsible === "none") {
    return (
      <div data-slot="sidebar" data-variant={variant} className={cn("group/sidebar flex h-full w-(--sidebar-width) flex-col text-fg", ground, variant === "sidebar" && "border-r border-hairline", className)} {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent data-slot="sidebar" data-sidebar="sidebar" data-mobile="true" data-variant={variant} side={side} name="navigation" className={cn("group/sidebar w-[min(var(--sidebar-width),calc(100vw-var(--ds-space-12)))] text-fg", ground)} style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">The app's sections and settings.</SheetDescription>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      className="group/sidebar peer hidden shrink-0 text-fg md:block"
    >
      {/* Holds the rail's room in the row, so the page beside it moves as it opens and closes. */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative h-full w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-out group-data-[collapsible=offcanvas]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon) in-data-[instant=true]:transition-none motion-reduce:transition-none",
          (variant === "floating" || variant === "inset") && "group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+var(--ds-space-4))]",
        )}
      >
        <div
          data-slot="sidebar-container"
          className={cn(
            "sticky top-0 z-10 flex h-svh max-h-full w-(--sidebar-width) overflow-hidden transition-[translate,width] duration-200 ease-out in-data-[instant=true]:transition-none motion-reduce:transition-none",
            side === "left" ? "left-0 group-data-[collapsible=offcanvas]/sidebar:-translate-x-full" : "ml-auto group-data-[collapsible=offcanvas]/sidebar:translate-x-full",
            variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+var(--ds-space-4))]" : "group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon)",
            variant === "sidebar" && (side === "left" ? "border-r border-hairline" : "border-l border-hairline"),
            className,
          )}
          {...props}
        >
          <div data-sidebar="sidebar" data-slot="sidebar-inner" className={cn("flex h-full w-full flex-col", ground, variant === "floating" && "overflow-hidden rounded-card border border-hairline shadow-guide")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open, isMobile, openMobile } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      aria-expanded={isMobile ? openMobile : open}
      className={cn("text-fg", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft strokeWidth={1.5} className="size-4" />
      <span className="sr-only">Toggle the rail</span>
    </Button>
  );
}

/** A thin strip along the rail's edge that toggles it, with a 2px 35 percent ink line under the pointer. */
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle the rail"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle the rail"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:bg-transparent after:transition-colors after:duration-150 after:ease-out hover:after:bg-line-strong sm:flex",
        "in-data-[side=left]:-right-4 in-data-[side=left]:cursor-w-resize in-data-[side=right]:left-0 in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        className,
      )}
      {...props}
    />
  );
}

/** The page beside the rail. With the inset rail it becomes a raised white panel: a hairline, 12px corners, the guide shadow. */
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("relative flex w-full min-w-0 flex-1 flex-col bg-surface", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-card md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-hairline md:peer-data-[variant=inset]:shadow-guide", className)}
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input variant="search" data-slot="sidebar-input" data-sidebar="input" className={className} {...props} />;
}

/** The rail's head: the lockup, a filter, or a workspace switcher. */
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" data-sidebar="header" className={cn("flex min-h-14 shrink-0 flex-col justify-center gap-3 px-2.5 pt-3.5 pb-2", className)} {...props} />;
}

/** The rail's foot (help, the account, Collapse), ruled off above. */
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" data-sidebar="footer" className={cn("flex shrink-0 flex-col gap-0.5 border-t border-line p-2.5", className)} {...props} />;
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="sidebar-separator" data-sidebar="separator" className={cn("mx-2.5 w-auto", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col overflow-auto overscroll-contain [scrollbar-width:none] group-data-[collapsible=icon]/sidebar:overflow-hidden", className)}
      {...props}
    />
  );
}

/** A group of rows; labeled groups are ruled apart by a 14 percent ink line, as the guides' panel rules its groups. */
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" data-sidebar="group" className={cn("relative flex w-full min-w-0 flex-col px-2.5 py-2 [&+&:has(>[data-slot=sidebar-group-label])]:border-t [&+&:has(>[data-slot=sidebar-group-label])]:border-line [&+&:has(>[data-slot=sidebar-group-label])]:pt-4", className)} {...props} />;
}

/** A group's label, the 14px display face at 500 in ink; it folds away when the rail is narrowed to its glyphs. */
function SidebarGroupLabel({ className, asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "mb-1.5 flex h-5 shrink-0 items-center px-2.5 font-display text-body-sm leading-snug font-medium whitespace-nowrap text-fg outline-none transition-[margin,opacity] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring group-data-[collapsible=icon]/sidebar:-mt-5 group-data-[collapsible=icon]/sidebar:opacity-0 motion-reduce:transition-none [&>svg]:size-3.5 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

/** A group's action beside its label (add, filter): a 14px glyph in a 24px key that washes under the pointer. */
function SidebarGroupAction({ className, asChild = false, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute top-2 right-3 flex size-6 cursor-pointer items-center justify-center rounded-sm text-fg-muted outline-none transition-[background-color,color] duration-150 ease-out hover:bg-wash-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring group-data-[collapsible=icon]/sidebar:hidden motion-reduce:transition-none [&>svg]:size-3.5 [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-content" data-sidebar="group-content" className={cn("w-full", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-0.5", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />;
}

// A row, as the guides' panel draws one: 14px Inter at 68 percent ink, 10px in, a 16px glyph 8px from the label; a 4
// percent ink wash under the pointer (color only, 150ms ease-out); the current row on the pale sky wash with blue text
// at 500 (white on the paper rail). Narrowed to icons, the row is a 32px square around its glyph.
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-control px-2.5 text-left font-sans text-fg-muted outline-none transition-[background-color,color] duration-150 ease-out group-has-data-[sidebar=menu-action]/menu-item:pr-9 group-data-[collapsible=icon]/sidebar:size-8! group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:p-0! group-data-[collapsible=icon]/sidebar:[&>span:not([data-slot=avatar])]:sr-only focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sky-wash data-[active=true]:font-medium data-[active=true]:text-fg-brand group-data-[variant=secondary]/sidebar:data-[active=true]:bg-surface group-data-[variant=inset]/sidebar:data-[active=true]:bg-surface data-[state=open]:bg-wash-hover data-[state=open]:text-fg motion-reduce:transition-none [&>span:last-child]:truncate [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "hover:bg-wash-hover hover:text-fg data-[active=true]:hover:bg-sky-wash data-[active=true]:hover:text-fg-brand group-data-[variant=secondary]/sidebar:data-[active=true]:hover:bg-surface group-data-[variant=inset]/sidebar:data-[active=true]:hover:bg-surface",
        outline: "border border-hairline bg-surface text-fg shadow-key hover:bg-sky-wash",
      },
      size: {
        default: "h-8 text-body-sm leading-snug",
        sm: "h-7 text-caption leading-snug [&>svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 text-body-sm leading-snug group-data-[collapsible=icon]/sidebar:p-0!",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean; tooltip?: string | React.ComponentProps<typeof TooltipContent> } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  // The tooltip names a row only while the rail shows glyphs alone; otherwise it stays shut, so it never catches Escape.
  const [tipOpen, setTipOpen] = React.useState(false);
  const showTip = state === "collapsed" && !isMobile;
  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
  if (!tooltip) return button;
  const content = typeof tooltip === "string" ? { children: tooltip } : tooltip;
  return (
    <Tooltip open={showTip && tipOpen} onOpenChange={setTipOpen}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" {...content} />
    </Tooltip>
  );
}

/** An action at a row's right end (a row's more glyph). `showOnHover` keeps it hidden until the row is hovered or open. */
function SidebarMenuAction({ className, asChild = false, showOnHover = false, ...props }: React.ComponentProps<"button"> & { asChild?: boolean; showOnHover?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-sm text-fg-muted outline-none transition-[background-color,color,opacity] duration-150 ease-out hover:bg-wash-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring group-data-[collapsible=icon]/sidebar:hidden motion-reduce:transition-none [&>svg]:size-3.5 [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-0.5 peer-data-[size=lg]/menu-button:top-3",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-fg md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A mark at a row's right end: `mark` is the brand's small tag (sky with blue caps in the 10px display face, tracked);
 * `count` is a quiet 12px number (unread items).
 */
function SidebarMenuBadge({ className, variant = "mark", ...props }: React.ComponentProps<"div"> & { variant?: "mark" | "count" }) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute top-1.5 right-2.5 flex h-5 items-center justify-center whitespace-nowrap select-none group-data-[collapsible=icon]/sidebar:hidden",
        "peer-data-[size=sm]/menu-button:top-1 peer-data-[size=lg]/menu-button:top-3.5",
        variant === "mark" ? "rounded-chip bg-sky px-1.5 font-display text-micro leading-none tracking-caps text-fg-brand uppercase" : "min-w-5 px-1 font-display text-caption text-fg-muted tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

/** A row's placeholder while the rail loads: a glyph square and a label of varying width. */
function SidebarMenuSkeleton({ className, showIcon = false, ...props }: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  // A width between 50 and 90 percent that differs from row to row but is the same on the server and in the browser.
  const id = React.useId();
  const width = `${50 + (([...id].reduce((sum, c) => (sum * 31 + c.charCodeAt(0)) % 997, 7) % 41))}%`;
  return (
    <div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" className={cn("flex h-8 items-center gap-2 rounded-control px-2.5", className)} {...props}>
      {showIcon && <Skeleton className="size-4 rounded-chip" data-sidebar="menu-skeleton-icon" />}
      <Skeleton className="h-3.5 max-w-(--skeleton-width) flex-1 rounded-chip" data-sidebar="menu-skeleton-text" style={{ "--skeleton-width": width } as React.CSSProperties} />
    </div>
  );
}

/** Rows nested under a row, hung from a 14 percent ink line under the parent's glyph. */
function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn("mx-4.5 mt-0.5 flex min-w-0 flex-col gap-0.5 border-l border-line py-0.5 pl-2.5 group-data-[collapsible=icon]/sidebar:hidden", className)}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-sub-item" data-sidebar="menu-sub-item" className={cn("group/menu-sub-item relative", className)} {...props} />;
}

function SidebarMenuSubButton({ asChild = false, size = "md", isActive = false, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean; size?: "sm" | "md"; isActive?: boolean }) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-7 min-w-0 cursor-pointer items-center gap-2 overflow-hidden rounded-control px-2.5 font-sans text-fg-muted outline-none transition-[background-color,color] duration-150 ease-out hover:bg-wash-hover hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sky-wash data-[active=true]:font-medium data-[active=true]:text-fg-brand group-data-[variant=secondary]/sidebar:data-[active=true]:bg-surface motion-reduce:transition-none [&>span:last-child]:truncate [&>svg]:size-3.5 [&>svg]:shrink-0",
        size === "sm" ? "text-caption" : "text-body-sm",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

```
