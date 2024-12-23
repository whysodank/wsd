'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import PasswordInput from '@/components/wsd/PasswordInput'

import { useFormState } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function PasswordResetForm({ passwordResetKey }: { passwordResetKey: string }) {
  const wsd = useWSDAPI()
  const router = useRouter()

  const {
    formState: passwordResetState,
    handleFormStateEvent: handlePasswordResetStateEvent,
    formErrors: passwordResetErrors,
    setFormErrors: setPasswordResetErrors,
  } = useFormState<{
    password: string
  }>({
    password: '',
  })

  async function handlePasswordReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { response, error } = await wsd.auth.resetPasswordWithKey({
      key: passwordResetKey,
      password: passwordResetState.password,
    })

    if (error && response?.status !== 401) {
      // Django Allauth returns 401 for a successful passwordReset attempt
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setPasswordResetErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast('Password reset failed.')
    } else {
      router.push('/auth/login')
      toast('Password reset successful.')
    }
  }

  return (
    <form onSubmit={handlePasswordReset}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            type="password"
            placeholder="Set a new password"
            required
            value={passwordResetState.password}
            onChange={handlePasswordResetStateEvent('password')}
            errorText={passwordResetErrors?.password?.join('\n')}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </div>
    </form>
  )
}
