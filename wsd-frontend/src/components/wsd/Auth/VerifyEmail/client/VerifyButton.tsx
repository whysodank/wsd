'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'

import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function VerifyButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { verificationKey: string }
) {
  const { children, verificationKey, ...buttonProps } = props
  const wsd = useWSDAPI()
  const router = useRouter()

  async function handleVerify() {
    const { error } = await wsd.auth.verifyEmail({ key: verificationKey })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      const fieldErrors = _.chain(errors)
        .groupBy('param')
        .mapValues((i) => i.map((i) => i.message))
        .value()
      toast('Verification failed.', { description: fieldErrors.key.join('\n') })
    } else {
      toast('Email verified successfully.')
      router.push('/auth/login')
    }
  }

  return (
    <Button onClick={handleVerify} {...buttonProps}>
      {children}
    </Button>
  )
}
