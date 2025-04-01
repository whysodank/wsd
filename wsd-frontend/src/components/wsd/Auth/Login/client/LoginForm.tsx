'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import PasswordInput from '@/components/wsd/PasswordInput'

import { useFormState } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function LoginForm() {
  const wsd = useWSDAPI()
  const router = useRouter()

  const {
    formState: loginState,
    handleFormStateEvent: handleLoginStateEvent,
    formErrors: loginErrors,
    setFormErrors: setLoginErrors,
  } = useFormState<{
    usernameOREmail: string
    password: string
  }>({
    usernameOREmail: '',
    password: '',
  })

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const usernameOREmail = loginState.usernameOREmail
    const { error } = await wsd.auth.login({
      username: usernameOREmail,
      password: loginState.password,
    })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      const fieldErrors = _.chain(errors)
        .groupBy('param')
        .mapValues((i) => i.map((i) => i.message))
        .value()
      setLoginErrors({
        usernameOREmail: [...(fieldErrors?.username || []), ...(fieldErrors?.email || [])],
        password: fieldErrors?.password,
      })
      toast('Login failed.')
    } else {
      router.push('/')
      router.refresh()
      toast('Logged in successfully.')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="usernameOREmail">Username/Email</Label>
          <Input
            id="usernameOREmail"
            type="text"
            placeholder="Enter your username or email"
            required
            value={loginState.usernameOREmail}
            onChange={handleLoginStateEvent('usernameOREmail')}
            errorText={loginErrors?.usernameOREmail?.join('\n')}
            autoComplete="username"
          />
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={loginState.password}
            onChange={handleLoginStateEvent('password')}
            errorText={loginErrors?.password?.join('\n')}
            autoComplete="password"
          />
          <div className="w-full flex justify-end items-center">
            <Link href={{ pathname: '/auth/forgot-password' }} className="text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  )
}
