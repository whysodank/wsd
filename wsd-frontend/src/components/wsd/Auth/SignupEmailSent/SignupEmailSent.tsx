import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'

export async function SignupEmailSent() {
  return (
    <>
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">Verification Email Sent</CardTitle>
          <CardDescription className="text-foreground">
            Please check your inbox for further instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          If you don't see the email, please check your spam folder. If you still don't see an email you can go through
          the signup process again to resend the email.
        </CardContent>
      </Card>
      <div className="flex justify-center items-center gap-2">
        <Link href={{ pathname: '/auth/login' }} className="hover:underline">
          Back To Login
        </Link>
      </div>
    </>
  )
}
