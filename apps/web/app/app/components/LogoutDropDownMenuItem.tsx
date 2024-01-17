"use client"
import { DropdownMenuItem, DropdownMenuShortcut } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
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
