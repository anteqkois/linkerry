import { cn } from '@linkerry/ui-components/utils'
import Link from 'next/link'
import { AnchorHTMLAttributes, ElementRef, forwardRef } from 'react'

export interface MenuItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  titleIcon: JSX.Element
  href: string
}

export const MenuItem = forwardRef<ElementRef<'a'>, MenuItemProps>(({ className, title, children, titleIcon, href, ...props }, ref) => {
  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        'flex items-center gap-4 select-none leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className,
      )}
      {...props}
    >
      <div>{titleIcon}</div>
      <div>
        <div className="flex items-center gap-1 text-sm md:text-lg font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-xs md:text-sm md:leading-snug text-muted-foreground">{children}</p>
      </div>
    </Link>
  )
})
MenuItem.displayName = 'MenuItem'
