import * as Icons from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'
import { RejectButton, VerifyButton } from '@/components/wsd/Auth/VerifyEmail/client'

export async function VerifyEmail({ verificationKey }: { verificationKey: string }) {
  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1 text-center">
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        <CardDescription>Please verify your email account by clicking the button below.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center flex flex-col gap-1">
          <small className="text-xs text-muted-foreground">
            This step is manual for security purposes. You still can decide not to verify your email.
          </small>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <VerifyButton className="flex-1 gap-2" variant="default" verificationKey={decodeURIComponent(verificationKey)}>
          <Icons.CheckCircle className="h-4 w-4" />
          <span>Verify</span>
        </VerifyButton>
        <RejectButton className="flex-1 gap-2" variant="destructive">
          <Icons.XCircle className="h-4 w-4" />
          <span>Reject</span>
        </RejectButton>
      </CardFooter>
    </Card>
  )
}
