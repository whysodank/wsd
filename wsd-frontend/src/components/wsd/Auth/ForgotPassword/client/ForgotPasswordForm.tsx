'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

import { useFormState } from '@/lib/hooks'
import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function RequestPasswordForm() {
  const wsd = getWSDAPI()
  const router = useRouter()

  const {
    formState: requestPasswordState,
    handleFormStateEvent: handleRequestPasswordStateEvent,
    formErrors: requestPasswordErrors,
    setFormErrors: setRequestPasswordErrors,
  } = useFormState<{
    email: string
  }>({
    email: '',
  })

  async function handleRequestPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await wsd.auth.requestPasswordReset({ email: requestPasswordState.email })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setRequestPasswordErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast("Couldn't send password reset email.")
    } else {
      router.push('/auth/password-reset-email-sent')
      toast('Password reset email sent.')
    }
  }

  return (
    <form onSubmit={handleRequestPassword}>
      <div className="flex flex-col gap-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={requestPasswordState.email}
          onChange={handleRequestPasswordStateEvent('email')}
          autoComplete="email"
          errorText={requestPasswordErrors?.email?.join('\n')}
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </div>
    </form>
  )
}
