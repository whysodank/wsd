import _ from 'lodash'

import { paths } from '@/api/schema'
import config from '@/config'
import { removeCookie } from '@/lib/serverActions'
import { getLazyValueAsync } from '@/lib/utils'

import createClient from 'openapi-fetch'

export class WSDAPI {
  config = config.api
  bearerToken: string | null | (() => Promise<string | null>)

  constructor(bearerToken: typeof this.bearerToken) {
    this.bearerToken = bearerToken
  }

  public async isAuthenticated(): Promise<boolean> {
    return !!(await getLazyValueAsync<string | null>(this.bearerToken))
  }

  fetchWrapper = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const bearerToken = await getLazyValueAsync<string | null>(this.bearerToken)

    init = init || {}
    init.headers = (init.headers instanceof Headers ? init.headers : { ...init.headers }) as Record<string, string>

    if (bearerToken) {
      init.headers[config.api.bearerTokenHeaderName] = `${config.api.bearerTokenPrefix} ${bearerToken}`
    }
    init.headers['Content-Type'] = 'application/json'
    init.cache = 'no-cache'
    const response = await fetch(input, init)
    try {
      if (_.isEqual(await response.clone().json(), { detail: 'Invalid token.' })) {
        // I do not like how this check looks, maybe the server should respond with something other than 401
        // Specifically for invalid token error?
        await removeCookie(config.api.bearerTokenCookieName)
      }
    } catch {}
    return response
  }

  // Create the client using the wrapped fetch function
  client = createClient<paths>({
    baseUrl: `${this.config.baseURL}`,
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: this.fetchWrapper,
  })

  private processQueryResult() {}

  public include(listOfResources: string[]): string {
    // Utility function to use ?include=resource1,resource2,resource3 feature of the api
    return listOfResources.join(',')
  }
}
