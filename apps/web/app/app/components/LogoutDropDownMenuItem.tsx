"use client"
import { DropdownMenuItem, DropdownMenuShortcut } from '@market-connector/ui-components/client'
import { useUser } from '../../../modules/user/useUser'
import { Icons } from '@market-connector/ui-components/server'

export function LogoutDropDownMenuItem() {
  const { logout } = useUser()

  return (
    <DropdownMenuItem onClick={logout}>
      Log out
      <DropdownMenuShortcut>
        <Icons.exit/>
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
