'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import PasswordInput from '@/components/wsd/PasswordInput'

import { useFormState } from '@/lib/hooks'
import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function CompleteSignupForm() {
  const wsd = getWSDAPI()
  const router = useRouter()

  const {
    formState: completeSignupState,
    handleFormStateEvent: handleCompleteSignupEvent,
    formErrors: completeSignupErrors,
    setFormErrors: setCompleteSignupErrors,
  } = useFormState<{
    username: string
    password: string
  }>({
    username: '',
    password: '',
  })

  async function handleCompleteSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await wsd.completeSignup({
      username: completeSignupState.username,
      password: completeSignupState.password,
    })
    if (error) {
      setCompleteSignupErrors(error)
      toast("Couldn't complete signup.")
    } else {
      router.push('/')
      toast('Signup completed successfully.')
    }
  }

  return (
    <form onSubmit={handleCompleteSignup}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Set a username"
            required
            value={completeSignupState.username}
            onChange={handleCompleteSignupEvent('username')}
            errorText={completeSignupErrors?.username?.join('\n')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            type="text"
            placeholder="Set a password"
            required
            value={completeSignupState.password}
            onChange={handleCompleteSignupEvent('password')}
            errorText={completeSignupErrors?.password?.join('\n')}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full">
          Complete Signup
        </Button>
      </div>
    </form>
  )
}
