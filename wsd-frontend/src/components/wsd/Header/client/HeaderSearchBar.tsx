'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useRef, useState } from 'react'

import * as Icons from 'lucide-react'

import { debounce } from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'

import { cn } from '@/lib/utils'

export function HeaderSearchBar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') || '')

  const searchInputRef = useRef<HTMLInputElement>(null)

  function handleSearch(searchValue: string) {
    const params = new URLSearchParams(searchParams)
    if (searchValue.trim().length < 3) {
      if (searchParams.has('search')) {
        params.delete('search')
        router.replace(`${pathname}?${params.toString()}`)
      }
      return
    }

    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  function focusSearchInput() {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const search = debounce((searchValue: string) => handleSearch(searchValue), 500, { leading: false, trailing: true })
  return (
    <div
      className={cn('relative flex items-center h-10', (isHovered || isFocused) && 'gap-1')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (value.trim().length > 0) {
          return
        }
        setIsHovered(false)
      }}
    >
      <Button variant={'ghost'} onClick={focusSearchInput} className="p-0" size="icon" aria-hidden="true">
        <Icons.Search size={20} className="w-10" />
      </Button>
      <Input
        ref={searchInputRef}
        type="text"
        className={cn(
          'transition-all duration-200 outline-none h-8',
          isHovered || isFocused ? 'w-[200px] opacity-100' : 'w-0 p-0 opacity-0'
        )}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          if (value.trim().length > 0) {
            return
          }
          setIsFocused(false)
        }}
        onChange={(e) => {
          setValue(e.target.value)
          search(e.target.value)
        }}
        placeholder="Search..."
      />
      <Button
        variant="ghost"
        className={cn(
          'absolute top-1/2 -translate-y-1/2 h-6 w-6 right-2 p-0 opacity-0 pointer-events-none transition-all duration-200',
          (isFocused || isHovered) && 'opacity-100 pointer-events-auto'
        )}
        size="icon"
      >
        <Icons.X
          size={20}
          className={cn('w-10')}
          onClick={() => {
            setValue('')
            handleSearch('')
            setIsFocused(false)
            setIsHovered(false)
          }}
        />
      </Button>
    </div>
  )
}
