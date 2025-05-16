'use client'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

import { APIType } from '@/api'
import { useFormState } from '@/lib/hooks'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default function SettingForm({ currentCardStyle }: { currentCardStyle: APIType<'CardStyleEnum'> }) {
  const wsd = sUseWSDAPI()
  const [loading, setLoading] = useState(false)
  const availableCardStyles: {
    [key: string]: {
      name: string
      icon: React.ReactNode
    }
  } = {
    RELAXED: {
      name: 'Relaxed',
      icon: <Icons.Smile size={20} />,
    },
    NORMAL: {
      name: 'Normal',
      icon: <Icons.LucideSquareMousePointer size={20} />,
    },
    COMPACT: {
      name: 'Compact',
      icon: <Icons.ShrinkIcon size={20} />,
    },
  }

  const {
    formState: userSettingState,
    handleFormStateValue: handleUserSettingValue,
    formErrors: userSettingErrors,
    setFormState: setUserSettingState,
    setFormErrors: setUserSettingErrors,
  } = useFormState<{
    card_style: APIType<'CardStyleEnum'>
  }>({
    card_style: currentCardStyle,
  })

  async function handleUserSettingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setLoading(true)
      const { data, error } = await wsd.patchMe(userSettingState)
      if (error) {
        setUserSettingErrors(error)
        return
      }
      if (data) {
        setUserSettingErrors({})
        if (data.card_style) {
          setUserSettingState({
            card_style: data.card_style,
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUserSettingSubmit}>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cardStyle">Card Style</Label>
          <Select
            value={userSettingState.card_style}
            onValueChange={handleUserSettingValue('card_style')}
            name="card_style"
            disabled={loading}
          >
            <SelectTrigger className="w-full" id="cardStyle">
              <SelectValue placeholder="Card Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(availableCardStyles).map(([cardStyle, data]) => (
                  <SelectItem
                    value={cardStyle}
                    key={cardStyle}
                    ref={(ref) => {
                      // Bugfix for mobile devices ( see #9 )
                      if (!ref) return
                      ref.ontouchstart = (e) => {
                        e.preventDefault()
                      }
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      {data.icon}
                      {data.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {userSettingErrors?.card_style?.join('\n') && (
            <span className="text-sm text-destructive whitespace-pre-line">
              {userSettingErrors?.card_style?.join('\n')}
            </span>
          )}
        </div>
        <div className="flex justify-end">
          <Button className="w-full" disabled={loading}>
            Save
          </Button>
        </div>
      </div>
    </form>
  )
}
