'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function LogoutButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  const wsd = getWSDAPI()
  const router = useRouter()

  async function handleLogout() {
    await wsd.auth.logout()
    router.push('/')
    router.refresh()
    toast('Successfully logged out.')
  }

  return (
    <Button onClick={handleLogout} {...buttonProps}>
      {children}
    </Button>
  )
}
