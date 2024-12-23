import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { PasswordResetForm } from '@/components/wsd/Auth/PasswordReset/client'

export async function PasswordReset({ passwordResetKey }: { passwordResetKey: string }) {
  return (
    <>
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">Signup</CardTitle>
          <CardDescription>Signup with your email or use an existing account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <PasswordResetForm passwordResetKey={passwordResetKey} />
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
