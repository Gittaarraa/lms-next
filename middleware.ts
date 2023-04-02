import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import config from './utils/config'

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/favicon.ico')||request.nextUrl.pathname.startsWith('/_next')||request.nextUrl.pathname.startsWith('/api/auth/logout')||request.nextUrl.pathname.startsWith('/api/auth/verify')||request.nextUrl.pathname.startsWith('/image')) return NextResponse.next()

    const session = request.cookies.get(config.cookie_name)?.value
    if (!session&&(request.nextUrl.pathname.startsWith('/api/auth')||request.nextUrl.pathname.startsWith('/login'))) return NextResponse.next()
    if (!session) return NextResponse.redirect(new URL('/login', request.url))

    const verify = await fetch(new URL('/api/auth/verify', request.url).toString()+`?token=${session}`, {
        method: 'GET'
    })
    const verifyResponse = await verify.json()
    if (verify.status!==200) return NextResponse.redirect(new URL('/api/auth/logout', request.url))
    if (session&&request.nextUrl.pathname.startsWith('/api/auth/session')) return NextResponse.next()
    if (session&&(request.nextUrl.pathname.startsWith('/api/auth')||request.nextUrl.pathname.startsWith('/login'))) return NextResponse.redirect(new URL('/classes', request.url))
    if (session&&!request.nextUrl.pathname.startsWith('/api/auth')&&!request.nextUrl.pathname.startsWith('/login')) return NextResponse.next()
}