import { UserProvider } from '../../modules/user/useUser'

import { ModeToggle } from '@linkerry/ui-components/client'
import ReactQueryProvider from '../reactQueryProvider'
import { DesktopMenu } from './components/DesktopMenu'
import { MobileMenu } from './components/MobileMenu'
import { MyAccountMenu } from './components/MyAccountMenu'

interface AuthLayoutProps {
	children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="min-h-screen bg-background-page">
			<ReactQueryProvider>
				<UserProvider>
					<div className="fixed top-0 z-40 flex justify-between items-center p-1 py-2 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
				</UserProvider>
			</ReactQueryProvider>
		</div>
	)
}
