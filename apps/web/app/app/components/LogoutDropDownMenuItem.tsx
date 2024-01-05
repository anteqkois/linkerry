"use client"
import { DropdownMenuItem, DropdownMenuShortcut } from '@market-connector/ui-components/client'
import { Icons } from '@market-connector/ui-components/server'
import { useUser } from '../../../modules/user/useUser'

export function LogoutDropDownMenuItem() {
  const { logout } = useUser()

  return (
    <DropdownMenuItem onClick={logout}>
      Log out
      <DropdownMenuShortcut>
        <Icons.Exit/>
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
