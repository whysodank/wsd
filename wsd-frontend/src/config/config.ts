import { booleanConfig, stringConfig } from '~/src/config/parsers'

const RAW = Object.freeze({
  debug: process.env.NEXT_PUBLIC_WSD__DEBUG,
  name: process.env.NEXT_PUBLIC_WSD__NAME,
  domain: process.env.NEXT_PUBLIC_WSD__DOMAIN,
  api: {
    baseURL: process.env.NEXT_PUBLIC_WSD__API__BASE_URL,
    authBaseURL: process.env.NEXT_PUBLIC_WSD__API__AUTH_BASE_URL,
  },
  devtools: {
    googleAnalytics: {
      gaID: process.env.NEXT_PUBLIC_WSD__FRONT_END__DEVTOOLS__GOOGLE_ANALYTICS__GA_ID,
    },
  },
})

export const config = Object.freeze({
  debug: booleanConfig({ name: 'debug', value: RAW.debug, default: false }),
  name: stringConfig({ name: 'name', value: RAW.name, default: 'WSD' }),
  domain: stringConfig({ name: 'domain', value: RAW.domain }),
  url: `https://${stringConfig({ name: 'domain', value: RAW.domain })}`,
  api: {
    baseURL: stringConfig({ name: 'api.baseURL', value: RAW.api.baseURL }),
    authBaseURL: stringConfig({ name: 'api.authBaseURL', value: RAW.api.authBaseURL }),
    sessionCookieName: 'sessionid',
    sessionTokenHeaderName: 'X-Session-Token',
    csrfTokenCookieName: 'csrftoken',
    csrfTokenHeaderName: 'X-CSRFToken',
    csrfTokenPostKey: 'csrfmiddlewaretoken',
  },
  ux: {
    defaultPostPerPage: 10, // It's infinite scroll, so this is how much we fetch per scroll
  },
  devtools: {
    googleAnalytics: {
      gaID: stringConfig({ name: 'googleAnalytics.gaID', value: RAW.devtools.googleAnalytics.gaID, default: '' }),
    },
  },
})
