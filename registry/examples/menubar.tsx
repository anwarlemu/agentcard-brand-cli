"use client";

import { useState } from "react";

import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";

function StatementBar({ defaultValue }: { defaultValue?: string }) {
  const [declined, setDeclined] = useState(true);
  const [group, setGroup] = useState("agent");
  return (
    <Menubar defaultValue={defaultValue}>
      <MenubarMenu value="statement">
        <MenubarTrigger>Statement</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New statement <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Download PDF <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email to finance</MenubarItem>
              <MenubarItem>Copy link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem disabled>Close the month</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={declined} onCheckedChange={(on) => setDeclined(on === true)}>
            Show declined purchases
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Group by</MenubarLabel>
          <MenubarRadioGroup value={group} onValueChange={setGroup}>
            <MenubarRadioItem value="agent">Agent</MenubarRadioItem>
            <MenubarRadioItem value="merchant">Merchant</MenubarRadioItem>
            <MenubarRadioItem value="day">Day</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="cards">
        <MenubarTrigger>Cards</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New card</MenubarItem>
          <MenubarItem>Set limits</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Freeze all cards</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function Site() {
  return (
    <div className="flex justify-center">
      <StatementBar />
    </div>
  );
}

export function Open() {
  return (
    <div className="flex h-80 justify-center">
      <StatementBar defaultValue="view" />
    </div>
  );
}
