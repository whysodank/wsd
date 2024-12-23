'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'

import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function DisconnectButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { provider: string; account: string }
) {
  const { provider, account, children, ...buttonProps } = props
  const wsd = useWSDAPI()
  const router = useRouter()

  async function handleDisconnect() {
    const { error } = await wsd.auth.removeConnection({ provider, account })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      const fieldErrors = _.chain(errors)
        .groupBy('param')
        .mapValues((i) => i.map((i) => i.message))
        .value()
      toast('Could not disconnect account.', { description: fieldErrors.account?.join('\n') })
    } else {
      router.refresh()
      toast('Disconnected account successfully.')
    }
  }

  return (
    <Button onClick={handleDisconnect} {...buttonProps}>
      {children}
    </Button>
  )
}
