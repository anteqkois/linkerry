import { RefreshTokenResponse } from '@linkerry/shared'
import { AuthStatus } from '@linkerry/shared/lib/common/auth'
import { Cookies } from '@linkerry/shared/lib/constants/cookies'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const authStatus = req.cookies.get(Cookies.AUTH_STATUS)
  const accessToken = req.cookies.get(Cookies.ACCESS_TOKEN)
  const refreshToken = req.cookies.get(Cookies.REFRESH_TOKEN)
  if (!authStatus || !accessToken || authStatus.value !== AuthStatus.AUTHENTICATED) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/auth/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${Cookies.REFRESH_TOKEN}=${refreshToken?.value}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      console.error('Failed to refresh token')
      return NextResponse.redirect(new URL(`/login?from=${req.nextUrl.pathname}`, req.url))
    }

    const data = await response.json() as RefreshTokenResponse
    if (data.success) return NextResponse.next()

    console.error('Unauthorized request', req.nextUrl.pathname, req.url)
    return NextResponse.redirect(new URL(`/login?from=${req.nextUrl.pathname}`, req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/app/:path*',
}
