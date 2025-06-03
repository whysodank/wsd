'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function DeleteEmailButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { email: string }
) {
  const { email, children, ...buttonProps } = props
  const wsd = getWSDAPI()
  const router = useRouter()

  async function handleDeleteEmail() {
    const { error } = await wsd.auth.removeEmail({ email })
    if (error) {
      toast('Failed to delete email')
    } else {
      toast('Email deleted successfully.')
      router.refresh()
    }
  }

  return (
    <Button onClick={handleDeleteEmail} {...buttonProps}>
      {children}
    </Button>
  )
}
