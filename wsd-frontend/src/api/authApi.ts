import config from '@/config'

export class WSD_AUTH_API {
  config = config.api
  _fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>

  constructor(fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {
    this._fetch = fetch
  }

  fetch = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    input = `${this.config.authBaseURL}${input}`
    return await this._fetch(input, init)
  }

  // Below are the untyped allauth API endpoints

  public async session() {
    return await this.fetch('/auth/session')
  }
}
