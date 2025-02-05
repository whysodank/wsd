'use client'

import React from 'react'

import * as Icons from 'lucide-react'

import { PopoverClose } from '@radix-ui/react-popover'

import { Button, buttonVariants } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { ScrollArea } from '@/components/shadcn/scroll-area'

import { cn } from '@/lib/utils'

export default function AdvancedSearch() {
  const [search, setSearch] = React.useState<string>('')

  async function handleAutocomplete(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    setSearch(event.target.value)
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Input
              type="text"
              name="search"
              placeholder="Search"
              autoComplete="false"
              className={cn(
                'pr-20 h-10 focus:outline-none focus:ring-0 focus-visible:outline-none',
                'focus-visible:ring-0 focus-visible:ring-offset-0'
              )}
              value={search}
              onChange={handleAutocomplete}
            />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto"
            sideOffset={5}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <ScrollArea>
              <div className="flex flex-col max-h-48 px-2 py-4">
                <PopoverClose asChild>
                  <div className={cn(buttonVariants({ variant: 'ghost', className: 'justify-start text-wrap' }))}>
                    There is no result
                  </div>
                </PopoverClose>
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
          <Button type="submit" variant="ghost" size="icon" className="h-full px-2 hover:bg-transparent">
            <Icons.Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
