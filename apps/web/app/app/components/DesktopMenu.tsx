// 'use client'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import Link from 'next/link'

interface DesktopProps {
  children?: React.ReactNode
}

export function DesktopMenu({ children }: DesktopProps) {
  return (
    // <nav className="hidden sm:block fixed top-1 left-1">
    <nav className="hidden sm:block ">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Flows</MenubarTrigger>
          <MenubarContent>
            <Link href="/app/flows/editor" prefetch={false}>
              <MenubarItem>
                Create New
                <MenubarShortcut>
                  <Icons.Plus />
                </MenubarShortcut>
              </MenubarItem>
            </Link>
            <Link href="/app/flows" prefetch={false}>
              <MenubarItem>All Flows</MenubarItem>
            </Link>
            <MenubarSeparator />
            <MenubarItem disabled>
              Create First Flow
              <MenubarShortcut>
                <Icons.Article />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Connectors</MenubarTrigger>
          <MenubarContent>
            <Link href="/app/connectors" prefetch={false}>
              <MenubarItem>
                All Connectors
                <MenubarShortcut>{/* <Icons.plus /> */}</MenubarShortcut>
              </MenubarItem>
            </Link>
            <Link href="/app/connectors/connections" prefetch={false}>
              <MenubarItem>Connected Apps</MenubarItem>
            </Link>
            <MenubarSeparator />
            <MenubarItem disabled>
              Security
              <MenubarShortcut>
                <Icons.Article />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {/* <MenubarMenu>
        <MenubarTrigger>Profile</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Dashboard</MenubarItem>
          <MenubarItem>Billing</MenubarItem>
          <MenubarItem>Settings</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Invite users</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                Rewards
                <MenubarShortcut>
                  <StarFilledIcon />
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Copy Reflink
                <MenubarShortcut>
                  <CopyIcon />
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Statistics</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu> */}
      </Menubar>
    </nav>
  )
}
