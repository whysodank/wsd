'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { debounce } from 'lodash'

import { Input } from '@/components/shadcn/input'

import { cn } from '@/lib/utils'

export function HeaderSearchBar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') || '')

  const handleSearch = (searchValue: string) => {
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

  const search = debounce((searchValue: string) => handleSearch(searchValue), 500, { leading: false, trailing: true })
  return (
    <div
      className={cn('flex items-center h-10', (isHovered || isFocused) && 'gap-1')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icons.Search size={20} className="w-10" />
      <Input
        type="text"
        className={cn(
          'transition-all duration-200 outline-none h-8',
          isHovered || isFocused ? 'w-[200px] opacity-100' : 'w-0 p-0 opacity-0'
        )}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          if (!value) {
            setIsHovered(false)
          }
        }}
        onChange={(e) => {
          setValue(e.target.value)
          search(e.target.value)
        }}
        placeholder="Search..."
      />
    </div>
  )
}
