'use client'

import { useEffect, useRef, PropsWithChildren } from 'react'

type ScrollToHashContainerProps = PropsWithChildren<{
  hash: string
  offset?: number
}>

function ScrollToHashContainer({ hash, offset = 0, children }: ScrollToHashContainerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const shouldScroll = window.location.hash === `#${hash}`
    if (shouldScroll && ref.current) {
      requestAnimationFrame(() => {
        if (!ref.current) return
        const top = ref.current.offsetTop - offset
        window.scrollTo({ top, behavior: 'smooth' })
      })
    }
  }, [hash])

  return (
    <div ref={ref}>  {/* Adding id here causes the browser's auto scroll behavior to kick in */}
      {children}
    </div>
  )
}

export { ScrollToHashContainer }
