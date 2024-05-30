import { UserProvider } from '../../modules/user/useUser'

import { ModeToggle } from '@linkerry/ui-components/client'
import ReactQueryProvider from '../../libs/reactQueryProvider'
import { ReachLimitDialog } from '../../modules/billing/components/ReachLimitDialog'
import { ReachLimitDialogProvider } from '../../modules/billing/useReachLimitDialog'
import { AuthGuard } from '../../modules/user/AuthGuard'
import { DesktopMenu } from './components/DesktopMenu'
import { LiveCharInitializer } from './components/LiveCharInitializer'
import { MobileMenu } from './components/MobileMenu'
import { MyAccountMenu } from './components/MyAccountMenu'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="">
      <ReactQueryProvider>
        <UserProvider>
          <AuthGuard />
          <ReachLimitDialogProvider>
            <div className="fixed h-14 top-0 z-40 flex justify-between items-center p-1 py-2 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-1">
                <MyAccountMenu />
                <MobileMenu />
                <DesktopMenu />
              </div>
              <div className="flex gap-1">
                <ModeToggle />
              </div>
            </div>
            {children}
            <LiveCharInitializer />
            <ReachLimitDialog />
          </ReachLimitDialogProvider>
        </UserProvider>
      </ReactQueryProvider>
    </div>
  )
}
