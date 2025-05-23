import { WSDAPI } from '@/api'
import config from '@/config'
import { withAttributes } from '@/lib/utils'

export const noDirectConsoleLog = withAttributes<Record<'__noDirectConsoleLog', boolean>>(
  function (window: Window) {
    if (typeof window !== 'undefined') {
      const originalConsole = {
        log: window.console.log.bind(window.console),
        info: window.console.info.bind(window.console),
        warn: window.console.warn.bind(window.console),
        error: window.console.error.bind(window.console),
      }

      const conditionalLog = (method: (...args: string[]) => void) => {
        return (...args: string[]) => {
          if (!noDirectConsoleLog.__noDirectConsoleLog) {
            method(...args)
          }
        }
      }

      window.console.log = conditionalLog(originalConsole.log)
      window.console.info = conditionalLog(originalConsole.info)
      window.console.warn = conditionalLog(originalConsole.warn)
      window.console.error = conditionalLog(originalConsole.error)

      const whysodank = window.whysodank || {}
      whysodank.debug = (flag: boolean) => {
        noDirectConsoleLog.__noDirectConsoleLog = !flag
      }
      window.whysodank = whysodank
    }
  },
  { __noDirectConsoleLog: true }
)

export function globalWSDAPI(window: Window) {
  function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts && parts.length === 2) {
      return parts.pop()?.split(';').shift()
    }
  }

  window.wsd = new WSDAPI(
    () => Promise.resolve(getCookie(config.api.sessionCookieName) || null),
    () => Promise.resolve(getCookie(config.api.csrfTokenCookieName) || null)
  )
  return window.wsd
}
