import { AuthStatus, Cookies } from '@market-connector/types'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const authStatus = req.cookies.get(Cookies.AUTH_STATUS)
  const accessToken = req.cookies.get(Cookies.ACCESS_TOKEN)
  if (!authStatus || !accessToken || authStatus.value !== AuthStatus.AUTHENTICATED)
    return NextResponse.redirect(new URL(`/login?from=${req.nextUrl.pathname}`, req.url))
  return NextResponse.next()
}

export const config = {
  matcher: '/app/:path*',
}
