'use client'

import { AuthStatus } from '@linkerry/shared'
import { useRouter } from 'next/navigation'
import { HTMLAttributes, useEffect } from 'react'
import { useUser } from './useUser'

export interface AuthGuardProps extends HTMLAttributes<HTMLElement> {}

export const AuthGuard = () => {
  const { authStatus } = useUser()
  const { push } = useRouter()

  useEffect(() => {
    if (authStatus === AuthStatus.UNAUTHENTICATED) {
      console.warn('User unauthenticated')
      push('/login')
    }
  }, [])

  return <></>
}
