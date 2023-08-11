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
} from '@market-connector/ui-components/client'
import Link from 'next/link'
import { Icons } from '@market-connector/ui-components/server'

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
              <Link href="/app/strategies/editor" prefetch={false}>
                Create New
              </Link>
              <MenubarShortcut>
                <Icons.plus/>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Edit Strategy
              <MenubarShortcut>
                <Icons.update />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Link href="/app/strategies/list" prefetch={false}>
                All Strategies
              </Link>
            </MenubarItem>
            <MenubarItem>Analysis</MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Create First Strategy
              <MenubarShortcut>
                <Icons.article/>
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
                <Icons.plus/>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Edit Condition
              <MenubarShortcut>
                <Icons.update />
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
                <Icons.article/>
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Exchanges</MenubarTrigger>
          <MenubarContent>
            <Link href="/app/user-keys/create" prefetch={false}>
              <MenubarItem>
                Add API Keys
                <MenubarShortcut>
                  <Icons.plus/>
                </MenubarShortcut>
              </MenubarItem>
            </Link>
            <Link href="/app/user-keys/list" prefetch={false}>
            <MenubarItem>My API keys</MenubarItem>
            </Link>
            <MenubarItem>Avaible Exchanges</MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Security
              <MenubarShortcut>
                <Icons.article/>
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
