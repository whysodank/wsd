import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'
import { ForgotPasswordForm } from '@/components/wsd/Auth/ForgotPassword/client'

export async function ForgotPassword() {
  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>Enter your email to receive a password verification email</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ForgotPasswordForm />
        <SeparatorWithText text="OR" />
        <div className="flex justify-center items-center gap-2">
          <Link href={{ pathname: '/auth/login' }} className="hover:underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
