import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@market-connector/ui-components/client'
import { Button,Icons } from '@market-connector/ui-components/server'

interface MobileProps {
  children?: React.ReactNode
}

export function MobileMenu({ children }: MobileProps) {
  return (
    <div className="sm:hidden fixed top-1 left-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.hamburgerMenu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex items-center gap-1 text-secondary">
                <Icons.strategy />
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
                <Icons.condition />
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
                <Icons.exchange />
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
