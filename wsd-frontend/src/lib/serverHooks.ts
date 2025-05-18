import { WSDAPI } from '@/api'
import config from '@/config'
import { getCookie } from '@/lib/serverActions'

export function getWSDAPI() {
  return new WSDAPI(
    () => getCookie(config.api.sessionCookieName) || null,
    () => getCookie(config.api.csrfTokenCookieName) || null
  )
}
