'use client'

import { useEffect } from 'react'

import { globalWSDAPI, noDirectConsoleLog } from '@/lib/monkeypatches'

export default function MonkeyPatches() {
  useEffect(() => {
    noDirectConsoleLog(window)
    globalWSDAPI(window)
  })

  return null
}
