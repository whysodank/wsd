'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function MarkEmailPrimaryButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { email: string }
) {
  const { email, children, ...buttonProps } = props
  const wsd = useWSDAPI()
  const router = useRouter()

  async function handleMarkEmailPrimary() {
    const { error } = await wsd.auth.markEmailPrimary({ email })
    if (error) {
      toast('Failed to mark email as primary.')
    } else {
      toast('Email marked primary successfully.')
      router.refresh()
    }
  }

  return (
    <Button onClick={handleMarkEmailPrimary} {...buttonProps}>
      {children}
    </Button>
  )
}
