import { WSD_AUTH_API } from '@/api/authApi'
import { paths } from '@/api/schema'
import type { APIQuery, APIType } from '@/api/typeHelpers'
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

  // Below this are api endpoint wrappers
  // In this order:
  // users
  // posts
  // post-comments
  public async users(filters?: APIQuery<'/v0/users/'>) {
    return await this.client.GET('/v0/users/', { params: { query: filters } })
  }

  public async user(id: string, query?: APIQuery<'/v0/users/{id}/'>) {
    return await this.client.GET('/v0/users/{id}/', { params: { path: { id }, query } })
  }

  public async me(query?: APIQuery<'/v0/users/me/'>) {
    return await this.client.GET('/v0/users/me/', { params: { query } })
  }

  public async putMe(data: APIType<'UserRequest'>) {
    return await this.client.PUT('/v0/users/me/', { body: data })
  }

  public async patchMe(data: APIType<'PatchedUserRequest'>) {
    return await this.client.PATCH('/v0/users/me/', { body: data })
  }

  public async posts(filters?: APIQuery<'/v0/posts/'>) {
    return await this.client.GET('/v0/posts/', { params: { query: filters } })
  }

  public async post(id: string, query?: APIQuery<'/v0/posts/{id}/'>) {
    return await this.client.GET('/v0/posts/{id}/', { params: { path: { id }, query } })
  }

  public async deletePost(id: string) {
    return await this.client.DELETE('/v0/posts/{id}/', { params: { path: { id } } })
  }

  public async putPost(id: string, data: APIType<'PostRequest'>) {
    return await this.client.PUT('/v0/posts/{id}/', { params: { path: { id } }, body: data })
  }

  public async patchPost(id: string, data: APIType<'PatchedPostUpdateRequest'>) {
    return await this.client.PATCH('/v0/posts/{id}/', { params: { path: { id } }, body: data })
  }

  public async upvotePost(id: string) {
    return await this.client.POST('/v0/posts/{id}/upvote/', { params: { path: { id } } })
  }

  public async downvotePost(id: string) {
    return await this.client.POST('/v0/posts/{id}/downvote/', { params: { path: { id } } })
  }

  public async unvotePost(id: string) {
    return await this.client.POST('/v0/posts/{id}/unvote/', { params: { path: { id } } })
  }
}
