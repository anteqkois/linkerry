import { UserProvider } from "../../modules/user/useUser"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <UserProvider>{children}</UserProvider>
    </div>
  )
}
