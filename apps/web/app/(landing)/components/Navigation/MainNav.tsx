'use client'

import Link from 'next/link'

import {
  ModeToggle,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Separator,
  navigationMenuTriggerStyle,
} from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
// import { useClickOutside } from '@react-hookz/web'
import { useRef, useState } from 'react'
import { MainNavItem } from '../../../../types'
import { MenuItem } from './MenuItem'
import { MobileNav } from './MobileNav'
import { NavFreeConsult } from '../FreeConsult'

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  // const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const ref = useRef(null)

  // useClickOutside(ref, () => {
  //   if(showMobileMenu)setShowMobileMenu(false)
  // })

  return (
    <>
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.LogoWhole className="w-40 h-full" />
      </Link>
      <Link href="/" className="items-center space-x-2 md:hidden">
        <Icons.Logo size={'md'} />
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <NavigationMenu key={index} delayDuration={50}>
              <NavigationMenuList>
                {item.href ? (
                  <NavigationMenuItem>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger disabled={item.disabled}>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2">
                      <ul className="grid grid-cols-1 lg:w-[410px] ">
                        {item.children.map((childrenEntry, index) => (
                          <div key={childrenEntry.title}>
                            <li>
                              <NavigationMenuLink asChild>
                                <MenuItem
                                  title={childrenEntry.title}
                                  href={childrenEntry.href}
                                  titleIcon={childrenEntry.titleIcon}
                                  ref={ref}
                                  className="space-y-1 rounded-md p-3"
                                >
                                  {childrenEntry.description}
                                </MenuItem>
                              </NavigationMenuLink>
                            </li>
                            {index !== item.children.length - 1 ? <Separator className="bg-border/50 my-1" /> : null}
                          </div>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          ))}
        </nav>
      ) : null}
      <nav className="flex gap-2 items-center">
        <NavFreeConsult />
        <ModeToggle />
      </nav>
      <Button className="md:hidden" size={'icon'} variant={'outline'} onClick={() => setShowMobileMenu((prev) => !prev)}>
        <Icons.HamburgerMenu />
      </Button>
      {showMobileMenu && items && (
        <MobileNav
          ref={ref}
          items={items}
          className="fixed left-0 right-0 top-16 z-50 animate-in slide-in-from-bottom-80"
          onItemSelect={() => setShowMobileMenu(false)}
        />
      )}
    </>
  )
}
