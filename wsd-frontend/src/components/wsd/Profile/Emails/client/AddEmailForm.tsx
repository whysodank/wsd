'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

import { useFormState } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function AddEmailForm() {
  const wsd = useWSDAPI()
  const router = useRouter()

  const {
    formState: addEmailState,
    handleFormStateEvent: handleAddEmailStateEvent,
    formErrors: addEmailErrors,
    setFormErrors: setAddEmailErrors,
  } = useFormState<{
    email: string
  }>({
    email: '',
  })

  async function handleAddEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await wsd.auth.addEmail({ email: addEmailState.email })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setAddEmailErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast('Adding email failed.')
    } else {
      router.refresh()
      toast('Email added successfully. Please verify your email.')
    }
  }

  return (
    <form onSubmit={handleAddEmail}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">New Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter new email address"
            required
            value={addEmailState.email}
            onChange={handleAddEmailStateEvent('email')}
            errorText={addEmailErrors?.email?.join('\n')}
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full">
          Add Email
        </Button>
      </div>
    </form>
  )
}
