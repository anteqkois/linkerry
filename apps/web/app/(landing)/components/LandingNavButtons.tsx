'use client'

import Link from 'next/link'

import { AuthStatus } from '@linkerry/shared'
import { buttonVariants } from '@linkerry/ui-components/client'
import { Button } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { useEffect, useState } from 'react'
import { useUser } from '../../../modules/user/useUser'

export function LandingNavButtons() {
  const { authStatus, logout } = useUser()
  const [logoutButton, setLogoutButton] = useState(false)

  useEffect(() => {
    console.log('authStatus', authStatus);
    if (authStatus === AuthStatus.AUTHENTICATED) setLogoutButton(true)
    else setLogoutButton(false)
  }, [authStatus])

  return (
    <>
      {logoutButton ? (
        <>
          <Button variant={'outline'} size={'sm'} className="px-4" onClick={() => logout({ withRedirect: false })}>
            logout
          </Button>
          <Link href="/app/dashboard" className={cn(buttonVariants({ size: 'sm' }), 'px-4')}>
            Dashboard
          </Link>
        </>
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
