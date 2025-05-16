'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'

type ScrollToHashContainerProps = PropsWithChildren<{
  hash?: string
  shouldScroll?: boolean
  offset?: number
  className?: string
}>

function ScrollToHashContainer({ hash, shouldScroll, className, offset = 0, children }: ScrollToHashContainerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hash === undefined && shouldScroll === undefined) return
    let shouldScrollPage = false
    if (hash && window.location.hash === `#${hash}`) {
      shouldScrollPage = true
    }
    if (shouldScroll !== undefined && shouldScroll !== shouldScrollPage) {
      shouldScrollPage = shouldScroll
    }
    if (shouldScrollPage && ref.current) {
      requestAnimationFrame(() => {
        if (!ref.current) return
        const top = ref.current.offsetTop - offset
        window.scrollTo({ top, behavior: 'smooth' })
      })
    }
  }, [hash, shouldScroll, offset])

  return (
    <div ref={ref}
         className={className}>  {/* Adding id here causes the browser's auto scroll behavior to kick in */}
      {children}
    </div>
  )
}

export { ScrollToHashContainer }
