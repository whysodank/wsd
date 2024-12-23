import Link from 'next/link'

import * as Brands from '@/components/icons/brands'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'
import { LoginForm } from '@/components/wsd/Auth/Login/client'
import { AutoFormButton } from '@/components/wsd/AutoFormButton/AutoFormButton'

import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function Login() {
  const providers = [
    { name: 'Google', icon: Brands.Google, id: 'google' },
    { name: 'Microsoft', icon: Brands.Microsoft, id: 'microsoft' },
    { name: 'GitHub', icon: Brands.GitHub, id: 'github' },
    { name: 'Discord', icon: Brands.Discord, id: 'discord' },
    { name: 'Reddit', icon: Brands.Reddit, id: 'reddit' },
  ]
  const wsd = sUseWSDAPI()
  return (
    <>
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Login with your email or use your existing login method</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <LoginForm />
          <SeparatorWithText text="OR" />
          <div className="w-full flex gap-2 items-center justify-center">
            {providers.map((provider) => (
              <AutoFormButton
                key={provider.id}
                variant="outline"
                className="gap-2 w-full"
                type="submit"
                method="POST"
                action={wsd.auth.socialAuthFormAction}
                payload={{ callback_url: `${config.url}/profile/connections`, process: 'login', provider: provider.id }}
              >
                <provider.icon />
              </AutoFormButton>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center items-center gap-2">
        <Link href={{ pathname: '/auth/signup' }} className="hover:underline">
          Signup
        </Link>
      </div>
    </>
  )
}
