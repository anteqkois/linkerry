import { AuthStatus, Cookies } from '@market-connector/types'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const authStatus = req.cookies.get(Cookies.AUTH_STATUS)
  if (!authStatus || authStatus.value !== AuthStatus.AUTHENTICATED)
    return NextResponse.redirect(new URL(`/login?from=${req.nextUrl.pathname}`, req.url))
  return NextResponse.next()
}

export const config = {
  matcher: '/app/:path*',
}
