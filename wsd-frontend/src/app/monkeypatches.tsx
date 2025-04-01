'use client'

import { useEffect } from 'react'

import { globalWSDAPI, noDirectConsoleLog } from '@/lib/monkeypatches'

export default function MonkeyPatches() {
  useEffect(() => {
    noDirectConsoleLog(window)
    const wsd = globalWSDAPI(window)
    wsd.auth.session() // Fetch the necessary CSRF token and session cookie during initial page load
  })

  return null
}
