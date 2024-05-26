import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import Link from 'next/link'

interface MobileProps {
  children?: React.ReactNode
}

export function MobileMenu({ children }: MobileProps) {
  return (
    <div className="sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Icons.HamburgerMenu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-[calc(100vh-60px)] overflow-y-scroll" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="font-medium">Flows</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/app/flows/editor" prefetch={false}>
              <DropdownMenuItem className="flex justify-between items-center">
                Create New
                <Icons.Plus />
              </DropdownMenuItem>
            </Link>
            <Link href="/app/flows" prefetch={false}>
              <DropdownMenuItem>All Flows</DropdownMenuItem>
            </Link>
            {/* // TODO create YT video and place link here */}
            <DropdownMenuItem className="flex justify-between items-center" disabled>
              Create First Flow
              <Icons.Article />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="font-medium">Connectors</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/app/connectors" prefetch={false}>
              <DropdownMenuItem>All Connectors</DropdownMenuItem>
            </Link>
            <Link href="/app/connectors/connections" prefetch={false}>
              <DropdownMenuItem>Connected Apps</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="flex justify-between items-center" disabled>
              Security
              <Icons.Article />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
