'use client'

import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

import * as Icons from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label } from '@/components/shadcn/label'

import { APIQuery } from '@/api'
import { useFormState } from '@/lib/hooks'

import { toast } from 'sonner'

export function MemesOption({
  params,
  onChange,
}: {
  params?: Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>
  onChange?: (params: Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>) => void
}) {
  const browserSearchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const [searchParams, setSearchParamsState] = useState<Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>>(
    params ||
      browserSearchParams
        .toString()
        .split('&')
        .reduce(
          (acc, param) => {
            const [key, value] = param.split('=')
            if (key && value) {
              // Handle boolean values
              if (value === 'true' || value === 'false') {
                acc[key as keyof typeof acc] = (value === 'true') as any
              } else {
                // For other values, you might need to add specific type handling
                acc[key as keyof typeof acc] = decodeURIComponent(value) as any
              }
            }

            return acc
          },
          {} as Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>
        )
  )

  useEffect(() => {
    // Update the state when the params change
    if (params) {
      setSearchParamsState(params)
    } else {
      const newParams: Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'> = {}
      browserSearchParams.forEach((value, key) => {
        // Type assertion to handle the dynamic key access
        const typedKey = key as keyof typeof newParams
        if (value === 'true' || value === 'false') {
          // Use type assertion to handle the assignment
          newParams[typedKey] = (value === 'true') as any
        } else {
          newParams[typedKey] = decodeURIComponent(value) as any
        }
      })
      setSearchParamsState(newParams)
    }
  }, [params, browserSearchParams])

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
    is_repost: searchParams.is_repost !== undefined ? String(searchParams.is_repost) === 'true' : undefined,
    is_original: searchParams.is_original !== undefined ? String(searchParams.is_original) === 'true' : undefined,
  })

  async function handleApplyMemesOption(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearchParams(memesOptionState)
    if (onChange) {
      onChange(memesOptionState)
    }
    toast('Memes options applied successfully.')
  }

  function onOverlayChange() {
    resetMemesOptionState()
  }

  function handleAccordionChange(value: string[]) {
    setIsOpen(value.includes('options'))
  }

  return (
    <Accordion type={'multiple'} onValueChange={handleAccordionChange}>
      <AccordionItem value={'options'}>
        <AccordionTrigger onChange={onOverlayChange} className="flex hover:bg-gray-500 rounded-md mb-2  h-4" hideArrow>
          <Icons.Settings
            size={16}
            className={`w-full transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : ''}`}
          />
        </AccordionTrigger>
        <AccordionContent>
          <form onSubmit={handleApplyMemesOption} className="flex flex-col gap-5">
            <div className="flex flex-row gap-2 items-center">
              <Checkbox
                id="isRepost"
                checked={memesOptionState.is_repost === false}
                onCheckedChange={(checked) =>
                  handleMemesOptionStateValue('is_repost')(checked === true ? false : undefined)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isRepost">Hide reposts</Label>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Checkbox
                id="isOriginal"
                checked={memesOptionState.is_original === true}
                onCheckedChange={(checked) =>
                  handleMemesOptionStateValue('is_original')(checked === false ? undefined : true)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isOriginal">Show only original posts</Label>
            </div>
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="w-full bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
