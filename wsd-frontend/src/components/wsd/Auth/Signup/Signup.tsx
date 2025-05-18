import Link from 'next/link'

import * as Brands from '@/components/icons/brands'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'
import { SignupForm } from '@/components/wsd/Auth/Signup/client'
import { AutoFormButton } from '@/components/wsd/AutoFormButton/AutoFormButton'

import config from '@/config'
import { getWSDAPI } from '@/lib/serverHooks'

export async function Signup() {
  const providers = [
    { name: 'Google', icon: Brands.Google, id: 'google' },
    { name: 'Microsoft', icon: Brands.Microsoft, id: 'microsoft' },
    { name: 'GitHub', icon: Brands.GitHub, id: 'github' },
    { name: 'Discord', icon: Brands.Discord, id: 'discord' },
    { name: 'Reddit', icon: Brands.Reddit, id: 'reddit' },
  ]
  const wsd = getWSDAPI()
  const tos = (
    <Link href={{ pathname: '/legal/terms-of-service' }} className="text-white hover:underline transition">
      Terms of Service
    </Link>
  )
  const privacyPolicy = (
    <Link href={{ pathname: '/legal/privacy-policy' }} className="text-white hover:underline transition">
      Privacy Policy
    </Link>
  )
  return (
    <>
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">Signup</CardTitle>
          <CardDescription>Signup with your email or use an existing account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <SignupForm />
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
          <div className="text-xs text-muted-foreground w-full text-center">
            By continuing, you agree to our {tos} and {privacyPolicy}.
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center items-center">
        <Link href={{ pathname: '/auth/login' }} className="hover:underline">
          Login
        </Link>
      </div>
    </>
  )
}
