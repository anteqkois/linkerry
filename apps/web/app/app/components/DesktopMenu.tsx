import { PlusIcon, ReaderIcon, UpdateIcon } from '@radix-ui/react-icons'

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@market-connector/ui-components'
import Link from 'next/link'

interface DesktopProps {
  children?: React.ReactNode
}

export function DesktopMenu({ children }: DesktopProps) {
  return (
    <nav className="hidden sm:block fixed top-1 left-1/2 -translate-x-1/2">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Strategies</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/app/strategies/create" prefetch={false}>
                Create New
              </Link>
              <MenubarShortcut>
                <PlusIcon />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Edit Strategy
              <MenubarShortcut>
                <UpdateIcon />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Link href="/app/strategies" prefetch={false}>
                All Strategies
              </Link>
            </MenubarItem>
            <MenubarItem>Analysis</MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Create First Strategy
              <MenubarShortcut>
                <ReaderIcon />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Conditions</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Create New
              <MenubarShortcut>
                <PlusIcon />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Edit Condition
              <MenubarShortcut>
                <UpdateIcon />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>All Conditions</MenubarItem>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarLabel>Condition Types</MenubarLabel>
              <MenubarItem>Alerts</MenubarItem>
              <MenubarItem disabled>Indicators</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarItem disabled>
              Create First Condition
              <MenubarShortcut>
                <ReaderIcon />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Exchanges</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Add Exchane
              <MenubarShortcut>
                <PlusIcon />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>My Exchanges</MenubarItem>
            <MenubarItem>Avaible Exchanges</MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Security
              <MenubarShortcut>
                <ReaderIcon />
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
