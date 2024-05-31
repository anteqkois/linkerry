'use client'

import { Cookies } from '@linkerry/shared'
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes, useEffect, useState } from 'react'

export interface CookiesModalProps extends HTMLAttributes<HTMLElement> {
  onAcceptCallback?: () => void
  onDeclineCallback?: () => void
}

export const CookiesModal = ({
  onAcceptCallback = () => {
    //
  },
  onDeclineCallback = () => {
    //
  },
}: CookiesModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hide, setHide] = useState(true)

  const accept = () => {
    setIsOpen(false)
    document.cookie = `${Cookies.COOKIE_CONSENT}=true; expires=Fri, 31 Dec 9999 23:59:59 GMT`
    setTimeout(() => {
      setHide(true)
    }, 700)
    onAcceptCallback()
  }

  const decline = () => {
    setIsOpen(false)
    setTimeout(() => {
      setHide(true)
    }, 700)
    onDeclineCallback()
  }

  useEffect(() => {
    setTimeout(() => {
      try {
        if (!document.cookie.includes(Cookies.COOKIE_CONSENT)) setIsOpen(true)
      } catch (e) {
        // console.log("Error: ", e);
      }
    }, 7_000)
  }, [])

  return (
    <Card
      className={cn(
        'fixed z-[200] bottom-0 left-0 right-0 sm:left-auto sm:right-4 sm:bottom-4 w-full sm:max-w-xl transition-transform duration-700',
        !isOpen ? 'transition-[opacity,transform] translate-y-8 opacity-0' : 'transition-[opacity,transform] translate-y-0 opacity-100',
        hide && 'hidden',
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>We use cookies</span>
          <Icons.Cookies className="h-[1.2rem] w-[1.2rem]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-normal">
          We use cookies to ensure you get the best experience on our website. For more information on how we use cookies, please see our cookie
          policy.
          <br />
          <br />
          <span className="text-xs">
            By clicking &quot;<span className="font-medium opacity-80">Accept</span>&quot;, you agree to our use of cookies.
          </span>{' '}
          <a rel="noreferrer noopener" target="_blank" href="/docs/linkerry_polityka_prywatności.pdf" className="text-xs underline">
            Learn more.
          </a>
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button onClick={accept} className="w-full">
          Accept
        </Button>
        <Button onClick={decline} className="w-full" variant="secondary">
          Decline
        </Button>
      </CardFooter>
    </Card>
  )
}
