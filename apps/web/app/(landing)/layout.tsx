import ReactQueryProvider from '../../libs/reactQueryProvider'
import { UserProvider } from '../../modules/user/useUser'
import { Footer } from './components/Footer'
import { MainNav } from './components/MianNav'
import { landingConfig } from './config'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <ReactQueryProvider>
      <div className="flex min-h-screen flex-col">
        <header className="z-40 bg-background">
          <div className="fixed h-16 top-0 z-40 w-full flex-center border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex justify-between items-center w-full max-w-7xl p-2 ">
              <UserProvider>
                <MainNav items={landingConfig.mainNav} />
              </UserProvider>
            </div>
          </div>
        </header>
        {children}
        <Footer />
      </div>
    </ReactQueryProvider>
  )
}
