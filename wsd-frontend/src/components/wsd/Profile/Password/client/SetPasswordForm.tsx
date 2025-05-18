'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import PasswordInput from '@/components/wsd/PasswordInput'

import { useFormState } from '@/lib/hooks'
import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function SetPasswordForm() {
  const wsd = getWSDAPI()
  const router = useRouter()

  const {
    formState: setPasswordState,
    handleFormStateEvent: handleSetPasswordStateEvent,
    formErrors: setPasswordErrors,
    setFormErrors: setSetPasswordErrors,
  } = useFormState<{
    password: string
  }>({
    password: '',
  })

  async function handlePasswordSet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await wsd.auth.resetUnusablePassword({ new_password: setPasswordState.password })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setSetPasswordErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast('Password set failed.')
    } else {
      router.refresh()
      toast('Password set successfully.')
    }
  }

  return (
    <form onSubmit={handlePasswordSet}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            type="password"
            placeholder="Set a new password"
            required
            value={setPasswordState.password}
            onChange={handleSetPasswordStateEvent('password')}
            errorText={setPasswordErrors?.password?.join('\n')}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full">
          Set Password
        </Button>
      </div>
    </form>
  )
}
