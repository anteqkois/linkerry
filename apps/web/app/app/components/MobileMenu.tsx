import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@market-connector/ui-components/client'
import { Button, Icons } from '@market-connector/ui-components/server'

interface MobileProps {
  children?: React.ReactNode
}

export function MobileMenu({ children }: MobileProps) {
  return (
    <div className="sm:hidden fixed top-1 left-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.HamburgerMenu className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-[calc(100vh-60px)] overflow-y-scroll" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex items-center gap-1 text-primary">
                <Icons.Strategy />
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
              <div className="flex items-center gap-1 text-primary">
                <Icons.Condition />
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
              <div className="flex items-center gap-1 text-primary">
                <Icons.Exchange />
                Exchanges
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>Add API Keys</DropdownMenuItem>
            <DropdownMenuItem>My API Keys</DropdownMenuItem>
            <DropdownMenuItem>Avaible Exchanges</DropdownMenuItem>
            <DropdownMenuItem disabled>Security</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
