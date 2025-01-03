import { WSD_AUTH_API } from '@/api/authApi'
import { paths } from '@/api/schema'
import config from '@/config'
import { getLazyValueAsync, setKeyValueToObjectIfValue } from '@/lib/utils'

import createClient from 'openapi-fetch'

export class WSDAPI {
  config = config.api
  sessionToken: string | null | (() => Promise<string | null>)
  csrfToken: string | null | (() => Promise<string | null>)
  auth: WSD_AUTH_API

  constructor(sessionToken: typeof this.sessionToken, csrfToken: typeof this.csrfToken) {
    this.sessionToken = sessionToken
    this.csrfToken = csrfToken
    this.auth = new WSD_AUTH_API(this.fetch)
  }

  isAuthenticated = async () => {
    const { response } = await this.auth.session()
    return response?.ok
  }

  fetch = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    const sessionToken = await getLazyValueAsync<string | null>(this.sessionToken)
    const csrfToken = await getLazyValueAsync<string | null>(this.csrfToken)

    init = init || {}
    init.headers = (init.headers instanceof Headers ? init.headers : { ...init.headers }) as Record<string, string>

    setKeyValueToObjectIfValue(config.api.sessionTokenHeaderName, sessionToken, init.headers)
    setKeyValueToObjectIfValue(config.api.csrfTokenHeaderName, csrfToken, init.headers)

    init.headers['Content-Type'] = 'application/json'
    init.credentials = 'include'
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
