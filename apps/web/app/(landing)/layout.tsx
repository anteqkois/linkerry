
import { SiteFooter } from '../../shared/components/SiteFooter'
import { MainNav } from './components/MianNav'
import { landingConfig } from './config'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="z-40 bg-background">
        <div className="fixed h-16 top-0 z-40 w-full flex-center border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex justify-between items-center w-full max-w-6xl p-2 ">
            <MainNav items={landingConfig.mainNav} />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
