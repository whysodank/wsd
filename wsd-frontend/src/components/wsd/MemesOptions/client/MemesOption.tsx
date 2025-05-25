'use client'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label } from '@/components/shadcn/label'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { APIQuery } from '@/api'
import { useFormState } from '@/lib/hooks'

import { toast } from 'sonner'

export function MemesOption({
  searchParams,
  onChange,
}: {
  searchParams: Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>
  onChange?: (params: Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>) => void
}) {
  const setSearchParams = (params: Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>) => {
    const url = new URL(window.location.href)
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, String(value))
      }
    })
    window.history.replaceState({}, '', url.toString())
  }

  const {
    formState: memesOptionState,
    handleFormStateValue: handleMemesOptionStateValue,
    resetFormState: resetMemesOptionState,
  } = useFormState<Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>>({
    // Because the searchParams are Strings when passed from Memes component
    is_repost: searchParams.is_repost ? String(searchParams.is_repost) === 'true' : undefined,
  })

  async function handleApplyMemesOption(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearchParams(memesOptionState)
    if (onChange) {
      onChange(memesOptionState)
    }
    toast('Memes options applied successfully.')
  }

  function onOverlayChange(open: boolean) {
    if (!open) {
      resetMemesOptionState()
    }
  }

  return (
    <Overlay breakpoint="md" onOpenChange={onOverlayChange}>
      <OverlayTrigger>
        <Button
          variant="ghost"
          className="absolute top-4 right-4 flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-secondary bg-transparent"
          aria-label="Memes Options"
        >
          <Icons.Settings size={20} />
        </Button>
      </OverlayTrigger>
      <OverlayContent
        className="z-50 min-w-[200px] w-full md:w-fit bg-background p-4 shadow-md rounded-md"
        popoverContentProps={{
          align: 'end',
          side: 'bottom',
          sideOffset: 5,
          alignOffset: -5,
        }}
        side="bottom"
      >
        <form onSubmit={handleApplyMemesOption} className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 items-center">
            <Checkbox
              id="isRepost"
              checked={memesOptionState.is_repost !== false}
              onCheckedChange={(checked) =>
                handleMemesOptionStateValue('is_repost')(checked === false ? false : undefined)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="isRepost">Show reposts</Label>
          </div>
          <Button
            type="submit"
            variant={'ghost'}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Apply
          </Button>
        </form>
      </OverlayContent>
    </Overlay>
  )
}
