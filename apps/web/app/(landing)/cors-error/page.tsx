'use client'

import { H4, Icons, P } from '@linkerry/ui-components/server'
import { useEffect } from 'react'
import { PageContainer } from '../../app/components/PageContainer'

const clearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}

export default function IndexPage() {
  useEffect(() => {
    clearCookies()
  }, [])

  return (
    <PageContainer variant={'centered'}>
      <div className="max-w-xl">
        <H4 className="flex justify-center items-center gap-2 text-warning">
          <Icons.Warn size={'md'}/>
          CORS error occures
        </H4>
        <P>
          We encountered an issue with your request due to browser security policies (CORS), sometimes this can happen in browsers like Brave etc.. To
          resolve this, please try the following steps:
        </P>
        <ol className='mt-4'>
          <li>
            <b>1. Logout:</b> If you are logged in, please log out and then log back in.
          </li>
          <li>
            <b>2. Clear Cookies:</b> We have automatically cleared your cookies for this page. Please refresh the page.
          </li>
          <li>
            <b>3. Turn Off Shields:</b> If you are using the Brave browser, try turning off Shields for this site.
          </li>
        </ol>
        <P>If the issue persists, please contact our support team for further assistance.</P>
      </div>
    </PageContainer>
  )
}
