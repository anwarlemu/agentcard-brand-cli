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
