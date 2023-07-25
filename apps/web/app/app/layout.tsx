import {
  CopyIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
  PlusIcon,
  ReaderIcon,
  StarFilledIcon,
  UpdateIcon,
} from '@radix-ui/react-icons'
import { UserProvider } from '../../modules/user/useUser'

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  ModeToggle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Button,
} from '@market-connector/ui-components'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // <div className="min-h-screen bg-card">
    <div className="min-h-screen bg-muted">
      <UserProvider>
        <div>
          <nav className="fixed top-1 left-1/2 -translate-x-1/2">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Strategies</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Create New
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
                  <MenubarItem>All Strategies</MenubarItem>
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
          <div className="fixed top-1 right-12">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <HomeIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>
                      <GearIcon />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-56">
                        <DropdownMenuItem>
                          Rewards
                          <DropdownMenuShortcut>
                            <StarFilledIcon />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Copy Reflink
                          <DropdownMenuShortcut>
                            <CopyIcon />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Statistics</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>
                    <ExitIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="fixed top-1 right-1">
            <ModeToggle />
          </div>
        </div>
        {children}
      </UserProvider>
    </div>
  )
}
