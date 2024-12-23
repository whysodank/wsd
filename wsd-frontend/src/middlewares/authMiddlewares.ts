import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { useWSDAPI } from '@/lib/serverHooks'
import { runMiddlewareIfPathMatches } from '@/lib/utils'

export function redirectAuthenticatedBackTo(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const wsd = useWSDAPI()
    const isAuthenticated = await wsd.isAuthenticated()
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}

export function redirectAnonymousBackTo(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const wsd = useWSDAPI()
    const isAuthenticated = await wsd.isAuthenticated()
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}
