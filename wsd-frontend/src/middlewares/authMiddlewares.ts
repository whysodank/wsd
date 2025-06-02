import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getWSDAPI } from '@/lib/serverHooks'
import { runMiddlewareIfPathMatches } from '@/lib/utils'

export function redirectAuthenticatedIncompleteSignup(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const wsd = getWSDAPI()
    const isAuthenticated = await wsd.isAuthenticated()
    const signupCompleted = await wsd.signupCompleted()
    if (isAuthenticated && !signupCompleted) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}

export function redirectAuthenticatedBackTo(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const wsd = getWSDAPI()
    const isAuthenticated = await wsd.isAuthenticated()
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}

export function redirectAnonymousBackTo(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const wsd = getWSDAPI()
    const isAuthenticated = await wsd.isAuthenticated()
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}
