import { ElementRef, HTMLAttributes, forwardRef, useCallback, useState } from 'react'

import { Separator } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import Link from 'next/link'
import { useLockBody } from '../../../shared/hooks/useLockBody'
import { MainNavItem } from '../../../types'
import { MenuItem } from './MenuItem'

interface MobileNavProps extends HTMLAttributes<HTMLDivElement> {
  items: MainNavItem[]
  onItemSelect: () => void
}

export const MobileNav = forwardRef<ElementRef<'div'>, MobileNavProps>(({ items, className, onItemSelect }, ref) => {
  useLockBody()
  const [openSubMenu, setOpenSubMenu] = useState('Products')

  const handleOpenMenu = useCallback(
    (newMenu: string) => {
      setOpenSubMenu((prev) => {
        if (prev === newMenu) return ''
        return newMenu
      })
    },
    [items],
  )

  return (
    <div className={cn('fixed z-50 shadow-md bg-background w-full', className)} ref={ref}>
      {items?.length ? (
        <nav className="gap-6 md:hidden">
          {items?.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <Link
                  onClick={onItemSelect}
                  className={cn(
                    'flex cursor-default select-none items-center rounded-sm p-3 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground ',
                    openSubMenu === item.title && 'bg-accent text-accent-foreground',
                  )}
                  href={item.href}
                >
                  {item.title}
                </Link>
              ) : (
                <MobileNavSubMenu item={item} handleOpenMenu={handleOpenMenu} openSubMenu={openSubMenu} onItemSelect={onItemSelect} />
              )}
            </div>
          ))}
        </nav>
      ) : null}
      <div className="inline-block w-screen h-screen bg-background -z-40 absolute top-0 left-0"></div>
    </div>
  )
})
MobileNav.displayName = 'MobileNav'

interface MobileNavSubMenuProps extends HTMLAttributes<HTMLDivElement> {
  item: MainNavItem
  openSubMenu: string
  handleOpenMenu: (newMenu: string) => void
  onItemSelect?: () => void
}

function MobileNavSubMenu({ item, openSubMenu, handleOpenMenu, onItemSelect }: MobileNavSubMenuProps) {
  return (
    <>
      <div className="p-1" onClick={() => handleOpenMenu(item.title)}>
        <div
          className={cn(
            'flex cursor-default select-none items-center rounded-sm p-2 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground ',
            openSubMenu === item.title && 'bg-accent/40 text-accent-foreground',
          )}
        >
          {item.title}
          <Icons.ArrowDown className="ml-auto h-4 w-4" />
        </div>
      </div>
      {openSubMenu === item.title ? (
        <ul className="grid grid-cols-1 gap-y-4 py-2 pb-6">
          {item.children.map((childrenEntry, index) => (
            <li key={childrenEntry.title}>
              <MenuItem
                onClick={onItemSelect}
                className="gap-2 px-2"
                key={childrenEntry.title}
                title={childrenEntry.title}
                href={childrenEntry.href}
                titleIcon={childrenEntry.titleIcon}
              >
                {childrenEntry.description}
              </MenuItem>
            </li>
          ))}
        </ul>
      ) : null}
      <Separator className="bg-border/50" />
    </>
  )
}
