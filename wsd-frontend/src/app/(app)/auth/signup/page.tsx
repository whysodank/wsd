import type { Metadata } from 'next'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function SignupPage() {
  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold">Signup</CardTitle>
        <CardDescription>Signup with your email or use an existing account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required autoComplete="username" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" required autoComplete="username" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password_confirmation">Password Confirmation</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Enter your password again"
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
        <SeparatorWithText text="OR" />
        <div className="w-full flex items-center justify-center">
          <form method="post" action={`${config.api.authBaseURL}/auth/provider/redirect`} className="w-full">
            <Button variant="outline" className="gap-2 w-full" type="submit">
              <Icons.LogIn />
              <span>Sign Up With Google</span>
            </Button>
            <Input type="hidden" name="callback_url" value={`https://${config.domain}/`} />
            <Input type="hidden" name="process" value="login" />
            <Input type="hidden" name="provider" value="google" />
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
