import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import * as AuthMiddlewares from '@/middlewares/authMiddlewares'
import * as HygieneMiddlewares from '@/middlewares/hygieneMiddlewares'

// https://github.com/lodash/lodash/issues/5525#issuecomment-2039091058
export const config = {
  runtime: 'experimental-edge',
  unstable_allowDynamic: ['**/node_modules/lodash*/**/*.js'],
}

const middlewares: ((request: NextRequest) => Promise<NextResponse | void>)[] = [
  HygieneMiddlewares.queryParamHygiene,
  AuthMiddlewares.redirectAuthenticatedIncompleteSignup(/^(?!\/profile\/complete-signup$)/, '/profile/complete-signup'),
  AuthMiddlewares.redirectAuthenticatedBackTo(/^(\/auth\/(?!verify-email\/).*)$/, '/'),
  AuthMiddlewares.redirectAnonymousBackTo(/^\/profile\//, '/auth/login'),
]

export async function middleware(request: NextRequest) {
  for (const mw of middlewares) {
    const response = await mw(request)
    if (response) {
      return response
    }
  }
  return NextResponse.next()
}
