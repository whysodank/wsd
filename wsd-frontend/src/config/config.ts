import { booleanConfig, numberConfig, stringConfig } from '~/src/config/parsers'

const RAW = Object.freeze({
  debug: process.env.NEXT_PUBLIC_WSD__DEBUG,
  name: process.env.NEXT_PUBLIC_WSD__NAME,
  domain: process.env.NEXT_PUBLIC_WSD__DOMAIN,
  api: {
    baseURL: process.env.NEXT_PUBLIC_WSD__API__BASE_URL,
    authBaseURL: process.env.NEXT_PUBLIC_WSD__API__AUTH_BASE_URL,
  },
  devtools: {
    sentry: {
      debug: process.env.NEXT_PUBLIC_WSD__FRONT_END__DEVTOOLS__SENTRY__DEBUG,
      dsn: process.env.NEXT_PUBLIC_WSD__FRONT_END__DEVTOOLS__SENTRY__DSN,
      tracesSampleRate: process.env.NEXT_PUBLIC_WSD__FRONT_END__DEVTOOLS__SENTRY__TRACES_SAMPLE_RATE,
      replaysSessionSampleRate: process.env.NEXT_PUBLIC_WSD__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_SESSION_SAMPLE_RATE,
      replaysOnErrorSampleRate: process.env.NEXT_PUBLIC_WSD__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_ON_ERROR_SAMPLE_RATE,
    },
    googleAnalytics: {
      gaID: process.env.NEXT_PUBLIC_WSD__FRONT_END__DEVTOOLS__GOOGLE_ANALYTICS__GA_ID,
    },
  },
  verification: {
    microsoft: {
      associatedApplicationID: process.env.NEXT_PUBLIC_WSD__VERIFICATION__MICROSOFT__ASSOCIATED_APPLICATION_ID,
    },
  },
  githubLink: process.env.NEXT_PUBLIC_WSD__GITHUB_LINK,
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
    sentry: {
      debug: false,
      dsn: stringConfig({ name: 'sentry.dsn', value: RAW.devtools.sentry.dsn, default: '' }),
      tracesSampleRate: numberConfig({
        name: 'sentry.tracesSampleRate',
        value: RAW.devtools.sentry.tracesSampleRate,
        default: 0,
      }),
      replaysSessionSampleRate: numberConfig({
        name: 'sentry.replaysSessionSampleRate',
        value: RAW.devtools.sentry.replaysSessionSampleRate,
        default: 0,
      }),
      replaysOnErrorSampleRate: numberConfig({
        name: 'sentry.replaysOnErrorSampleRate',
        value: RAW.devtools.sentry.replaysOnErrorSampleRate,
        default: 0,
      }),
    },
    googleAnalytics: {
      gaID: stringConfig({ name: 'googleAnalytics.gaID', value: RAW.devtools.googleAnalytics.gaID, default: '' }),
    },
  },
  verification: {
    microsoft: {
      associatedApplicationID: stringConfig({
        name: 'verification.microsoft.associatedApplicationID',
        value: RAW.verification.microsoft.associatedApplicationID,
        default: '',
      }),
    },
  },
  githubLink: stringConfig({ name: 'githubLink', value: RAW.githubLink, default: '' }),
})
