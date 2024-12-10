import { WSD_AUTH_API } from '@/api/authApi'
import { paths } from '@/api/schema'
import config from '@/config'
import { getLazyValueAsync } from '@/lib/utils'

import createClient from 'openapi-fetch'

export class WSDAPI {
  config = config.api
  sessionToken: string | null | (() => Promise<string | null>)
  auth: WSD_AUTH_API

  constructor(sessionToken: typeof this.sessionToken) {
    this.sessionToken = sessionToken
    this.auth = new WSD_AUTH_API(this.fetch)
  }

  isAuthenticated = async () => {
    const response = await this.auth.session()
    return response.ok
  }

  fetch = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    const sessionToken = await getLazyValueAsync<string | null>(this.sessionToken)

    init = init || {}
    init.headers = (init.headers instanceof Headers ? init.headers : { ...init.headers }) as Record<string, string>

    if (sessionToken) {
      init.headers[config.api.sessionTokenHeaderName] = sessionToken
    }
    init.headers['Content-Type'] = 'application/json'
    init.cache = 'no-cache'
    return await fetch(input, init)
  }

  // Create the client using the wrapped fetch function
  client = createClient<paths>({
    baseUrl: `${this.config.baseURL}`,
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: this.fetch,
  })

  public include(listOfResources: string[]): string {
    // Utility function to use ?include=resource1,resource2,resource3 feature of the api
    return listOfResources.join(',')
  }
}
