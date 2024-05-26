'use client'

import Link from 'next/link'

import { AuthStatus } from '@linkerry/shared'
import { buttonVariants } from '@linkerry/ui-components/client'
import { Button } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { useEffect, useState } from 'react'
import { useUser } from '../../../modules/user/useUser'

interface MainNavProps {}

export function LandingNavButtons() {
  const { authStatus, logout } = useUser()
  const [logoutButton, setLogoutButton] = useState(false)

  useEffect(() => {
    if (authStatus === AuthStatus.AUTHENTICATED) setLogoutButton(true)
  }, [authStatus])

  return (
    <>
      {logoutButton ? (
        <Button variant={'outline'} size={'sm'} className="px-4" onClick={logout}>
          logout
        </Button>
      ) : (
        <>
          <Link href="/login" className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'px-4')}>
            Login
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ size: 'sm' }), 'px-4')}>
            Start Free
          </Link>
        </>
      )}
    </>
  )
}
