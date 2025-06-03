'use client'

import { useEffect, useState } from 'react'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'

import { cn } from '@/lib/utils'

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 200 px
      if (window.scrollY > 200) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Button
      variant={'outline'}
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-full transition-opacity duration-300 ease-in-out px-2',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={scrollToTop}
    >
      <Icons.ArrowUp size={24} className="h-6 w-6" aria-hidden="true" />
    </Button>
  )
}
