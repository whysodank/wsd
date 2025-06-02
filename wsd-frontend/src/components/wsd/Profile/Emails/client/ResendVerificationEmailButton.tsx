'use client'

import { Button } from '@/components/shadcn/button'

import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function ResendVerificationEmailButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { email: string }
) {
  const { email, children, ...buttonProps } = props
  const wsd = getWSDAPI()

  async function handleResendVerificationEmail() {
    const { error } = await wsd.auth.resendVerificationEmail({ email })
    if (error) {
      toast('Resending email verification email failed.')
    } else {
      toast('Resent email verification email successfully.')
    }
  }

  return (
    <Button onClick={handleResendVerificationEmail} {...buttonProps}>
      {children}
    </Button>
  )
}
