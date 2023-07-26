"use client"
import { DropdownMenuItem, DropdownMenuShortcut } from '@market-connector/ui-components'
import { ExitIcon } from '@radix-ui/react-icons'
import { useUser } from '../../../modules/user/useUser'

export function LogoutDropDownMenuItem() {
  const { logout } = useUser()

  return (
    <DropdownMenuItem onClick={logout}>
      Log out
      <DropdownMenuShortcut>
        <ExitIcon />
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
