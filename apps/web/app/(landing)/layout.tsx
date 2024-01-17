import Link from 'next/link'

import { ModeToggle } from '@linkerry/ui-components/client'
import { buttonVariants } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { MainNav } from '../../shared/components/MianNav'
import { SiteFooter } from '../../shared/components/SiteFooter'
import { marketingConfig } from './config'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <nav className='flex gap-2 items-center'>
            <Link href="/login" className={cn(buttonVariants({ size: 'sm' }), 'px-4')}>
              Login
            </Link>
            <ModeToggle/>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
