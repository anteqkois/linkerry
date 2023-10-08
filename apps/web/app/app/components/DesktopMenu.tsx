import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@market-connector/ui-components/client'
import { Icons } from '@market-connector/ui-components/server'
import Link from 'next/link'

interface DesktopProps {
  children?: React.ReactNode
}

export function DesktopMenu({ children }: DesktopProps) {
  return (
    <nav className="hidden sm:block fixed top-1 left-1/2 -translate-x-1/2">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Flows</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/app/flows/editor" prefetch={false}>
                Create New
              </Link>
              <MenubarShortcut>
                <Icons.plus />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Edit Flow
              <MenubarShortcut>
                <Icons.update />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Link href="/app/flows/list" prefetch={false}>
                All Flows
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Create First Flow
              <MenubarShortcut>
                <Icons.article />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>History</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Runs Hisory
              <MenubarShortcut>{/* <Icons.plus /> */}</MenubarShortcut>
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
            <Link href="/app/connecotrs/connections" prefetch={false}>
              <MenubarItem>Your Connected Apps</MenubarItem>
            </Link>
            <MenubarSeparator />
            <MenubarItem disabled>
              Security
              <MenubarShortcut>
                <Icons.article />
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
