'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import * as React from 'react'

import {
  ModeToggle,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  buttonVariants,
  navigationMenuTriggerStyle,
} from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { MobileNav } from '../../../shared/components/MobileNav'
import { MainNavItem } from '../../../types'

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <>
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.LogoWhole className="w-40 h-full" />
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <NavigationMenu key={index}>
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
                      <ul className="grid grid-cols-1 lg:w-[400px] ">
                        {item.children.map((childrenEntry) => (
                          <ListItem
                            key={childrenEntry.title}
                            title={childrenEntry.title}
                            href={childrenEntry.href}
                            titleIcon={childrenEntry.titleIcon}
                          >
                            {childrenEntry.description}
                          </ListItem>
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
        <Link href="/login" className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'px-4')}>
          Login
        </Link>
        <Link href="/login" className={cn(buttonVariants({ size: 'sm' }), 'px-4')}>
          Start Free
        </Link>
        <ModeToggle />
      </nav>
      <button className="flex items-center space-x-2 md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? <Icons.Close /> : <Icons.Logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && <MobileNav items={items}>{children}</MobileNav>}
    </>
  )
}

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  titleIcon: JSX.Element
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(({ className, title, children, titleIcon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'flex items-center gap-4 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div>{titleIcon}</div>
          <div>
            <div className="flex items-center gap-1 text-lg font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
