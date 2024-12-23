'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import PasswordInput from '@/components/wsd/PasswordInput'

import { useFormState } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function ChangePasswordForm() {
  const wsd = useWSDAPI()
  const router = useRouter()

  const {
    formState: passwordResetState,
    handleFormStateEvent: handlePasswordResetStateEvent,
    formErrors: passwordResetErrors,
    setFormErrors: setPasswordResetErrors,
  } = useFormState<{
    current_password: string
    new_password: string
  }>({
    current_password: '',
    new_password: '',
  })

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await wsd.auth.resetPassword({
      current_password: passwordResetState.current_password,
      new_password: passwordResetState.new_password,
    })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setPasswordResetErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast('Password change failed.')
    } else {
      router.refresh()
      toast('Password changed successfully.')
    }
  }

  return (
    <form onSubmit={handlePasswordChange}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <PasswordInput
            id="currentPassword"
            type="password"
            placeholder="Enter your current password"
            required
            value={passwordResetState.current_password}
            onChange={handlePasswordResetStateEvent('current_password')}
            errorText={passwordResetErrors?.current_password?.join('<br>')}
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordInput
            id="newPassword"
            type="password"
            placeholder="Set a new password"
            required
            value={passwordResetState.new_password}
            onChange={handlePasswordResetStateEvent('new_password')}
            errorText={passwordResetErrors?.new_password?.join('\n')}
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
