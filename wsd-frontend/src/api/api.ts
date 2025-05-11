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

  signupCompleted = async () => {
    const { data } = await this.auth.session()
    return data?.data?.user?.signup_completed || false
  }

  getCurrentUser = async (): Promise<APIType<'User'> | undefined> => {
    const { data: userData } = await this.me()
    return userData
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

  public hasResults<T>(resource: undefined | { results: T[] }): resource is { results: T[] } {
    return !!resource && resource.results.length > 0
  }

  public hasNoResult<T>(resource: undefined | { results: T[] }): resource is { results: T[] } {
    return !!resource && resource.results.length === 0
  }

  public getFirst<T>(resource: { results: T[] }): T | undefined {
    return resource.results[0]
  }

  // Below this are api endpoint wrappers
  // In this order:
  // users
  // posts
  // post-categories
  // post-tags
  // post-comments
  // notifications
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

  public async completeSignup(data: APIType<'UserCompleteSignupRequest'>) {
    return await this.client.POST('/v0/users/me/complete-signup/', { body: data })
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

  public async createPost(data: APIType<'PostRequest'>) {
    return await this.client.POST('/v0/posts/', { body: data })
  }

  public async deletePost(id: string) {
    return await this.client.DELETE('/v0/posts/{id}/', { params: { path: { id } } })
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

  public async bookmarkPost(id: string) {
    return await this.client.POST('/v0/posts/{id}/bookmark/', { params: { path: { id } } })
  }

  public async unbookmarkPost(id: string) {
    return await this.client.POST('/v0/posts/{id}/unbookmark/', { params: { path: { id } } })
  }

  public async postCategories(filters?: APIQuery<'/v0/post-categories/'>) {
    return await this.client.GET('/v0/post-categories/', { params: { query: filters } })
  }

  public async postCategory(id: string, query?: APIQuery<'/v0/post-categories/{id}/'>) {
    return await this.client.GET('/v0/post-categories/{id}/', { params: { path: { id }, query } })
  }

  public async postTags(filters?: APIQuery<'/v0/post-tags/'>) {
    return await this.client.GET('/v0/post-tags/', { params: { query: filters } })
  }

  public async postTag(id: string, query?: APIQuery<'/v0/post-tags/'>) {
    return await this.client.GET('/v0/post-tags/{id}/', { params: { path: { id }, query } })
  }

  public async postComments(filters?: APIQuery<'/v0/post-comments/'>) {
    return await this.client.GET('/v0/post-comments/', { params: { query: filters } })
  }

  public async postComment(id: string, query?: APIQuery<'/v0/post-comments/{id}/'>) {
    return await this.client.GET('/v0/post-comments/{id}/', { params: { path: { id }, query } })
  }

  public async createPostComment(data: APIType<'PostCommentRequest'>) {
    return await this.client.POST('/v0/post-comments/', { body: data })
  }

  public async deletePostComment(id: string) {
    return await this.client.DELETE('/v0/post-comments/{id}/', { params: { path: { id } } })
  }

  public async putPostComment(id: string, data: APIType<'PostCommentRequest'>) {
    return await this.client.PUT('/v0/post-comments/{id}/', { params: { path: { id } }, body: data })
  }

  public async patchPostComment(id: string, data: APIType<'PatchedPostCommentUpdateRequest'>) {
    return await this.client.PATCH('/v0/post-comments/{id}/', { params: { path: { id } }, body: data })
  }

  public async upvotePostComment(id: string) {
    return await this.client.POST('/v0/post-comments/{id}/upvote/', { params: { path: { id } } })
  }

  public async downvotePostComment(id: string) {
    return await this.client.POST('/v0/post-comments/{id}/downvote/', { params: { path: { id } } })
  }

  public async unvotePostComment(id: string) {
    return await this.client.POST('/v0/post-comments/{id}/unvote/', { params: { path: { id } } })
  }

  public async notifications(filters?: APIQuery<'/v0/notifications/'>) {
    return await this.client.GET('/v0/notifications/', { params: { query: filters } })
  }

  public async notification(id: string, query?: APIQuery<'/v0/notifications/{id}/'>) {
    return await this.client.GET('/v0/notifications/{id}/', { params: { path: { id }, query } })
  }

  public async putNotification(id: string, data: APIType<'PatchedNotificationUpdateRequest'>) {
    return await this.client.PUT('/v0/notifications/{id}/', { params: { path: { id } }, body: data })
  }

  public async patchNotification(id: string, data: APIType<'PatchedNotificationUpdateRequest'>) {
    return await this.client.PATCH('/v0/notifications/{id}/', { params: { path: { id } }, body: data })
  }

  public async markAllNotificationsAsRead() {
    return await this.client.POST('/v0/notifications/mark-all-as-read/', {})
  }
}
