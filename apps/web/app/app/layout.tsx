import { UserProvider } from '../../modules/user/useUser'

import { ModeToggle } from '@market-connector/ui-components/client'
import { DesktopMenu } from './components/DesktopMenu'
import { MobileMenu } from './components/MobileMenu'
import { MyAccountMenu } from './components/MyAccountMenu'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-muted">
      <UserProvider>
        <div>
          <MobileMenu />
          <DesktopMenu />
          <div className="fixed top-1 right-12">
            <MyAccountMenu />
          </div>
          <div className="fixed top-1 right-1">
            <ModeToggle />
          </div>
        </div>
        {children}
      </UserProvider>
    </div>
  )
}
