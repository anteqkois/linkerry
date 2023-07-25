import { Component1Icon, ComponentInstanceIcon, CubeIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Button,
  DropdownMenuSeparator,
} from '@market-connector/ui-components'

interface MobileProps {
  children?: React.ReactNode
}

export function MobileMenu({ children }: MobileProps) {
  return (
    <div className="sm:hidden fixed top-1 left-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex items-center gap-1 text-secondary">
                <Component1Icon />
                Strategies
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>Create New</DropdownMenuItem>
            <DropdownMenuItem>Edit Strategy</DropdownMenuItem>
            <DropdownMenuItem>All Strategies</DropdownMenuItem>
            <DropdownMenuItem>Analysis</DropdownMenuItem>
            <DropdownMenuItem disabled>Create First Strategy</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex items-center gap-1 text-secondary">
                <ComponentInstanceIcon />
                Conditions
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>Create New</DropdownMenuItem>
            <DropdownMenuItem>Edit Condition</DropdownMenuItem>
            <DropdownMenuItem>All Conditions</DropdownMenuItem>
            <DropdownMenuLabel>Condition Types</DropdownMenuLabel>
            <DropdownMenuItem>Alerts</DropdownMenuItem>
            <DropdownMenuItem disabled>Inicators</DropdownMenuItem>
            <DropdownMenuItem disabled>Create First Condition</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex items-center gap-1 text-secondary">
                <CubeIcon />
                Exchanges
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>Add Exchange</DropdownMenuItem>
            <DropdownMenuItem>My Exchanges</DropdownMenuItem>
            <DropdownMenuItem>MAvaible Exchanges</DropdownMenuItem>
            <DropdownMenuItem disabled>Security</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
