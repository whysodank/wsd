'use client'

import { useRouter } from 'next/navigation'

import { useState } from 'react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import PasswordInput from '@/components/wsd/PasswordInput'

import { useFormState } from '@/lib/hooks'
import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function SignupForm() {
  const wsd = getWSDAPI()
  const router = useRouter()
  const [registrationDisabled, setRegistrationDisabled] = useState<boolean>(false)

  const {
    formState: signupState,
    handleFormStateEvent: handleSignupStateEvent,
    formErrors: signupErrors,
    setFormErrors: setSignupErrors,
  } = useFormState<{
    username: string
    email: string
    password: string
  }>({
    username: '',
    email: '',
    password: '',
  })

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    try {
      setRegistrationDisabled(true)
      event.preventDefault()
      const { response, error } = await wsd.auth.signup({
        username: signupState.username,
        email: signupState.email,
        password: signupState.password,
      })
      if (error && response?.status !== 401) {
        // Django Allauth returns 401 for a successful signup attempt
        const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
        setSignupErrors(
          _.chain(errors)
            .groupBy('param')
            .mapValues((i) => i.map((i) => i.message))
            .value()
        )
        toast('Signup failed.')
      } else {
        router.push('/auth/signup-email-sent')
        toast('Signed up successfully. Please check your email for verification.')
      }
    } catch {
      toast('Signup failed.')
    } finally {
      setRegistrationDisabled(false)
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter a username"
            required
            value={signupState.username}
            onChange={handleSignupStateEvent('username')}
            errorText={signupErrors?.username?.join('\n')}
            autoComplete="username"
          />
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={signupState.email}
            onChange={handleSignupStateEvent('email')}
            errorText={signupErrors?.email?.join('\n')}
            autoComplete="email"
          />
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            type="password"
            placeholder="Set a new password"
            required
            value={signupState.password}
            onChange={handleSignupStateEvent('password')}
            errorText={signupErrors?.password?.join('\n')}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={registrationDisabled}>
          Signup
        </Button>
      </div>
    </form>
  )
}
