import { AuthStatus } from '@linkerry/shared/lib/common/auth';
import { Cookies } from '@linkerry/shared/lib/constants/cookies';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const authStatus = req.cookies.get(Cookies.AUTH_STATUS)
  const accessToken = req.cookies.get(Cookies.ACCESS_TOKEN)
  if (!authStatus || !accessToken || authStatus.value !== AuthStatus.AUTHENTICATED) {
    console.log('Unauthorized request', req.nextUrl.pathname, req.url)
    return NextResponse.redirect(new URL(`/login?from=${req.nextUrl.pathname}`, req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/app/:path*',
}
