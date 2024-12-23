'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { useWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function LogoutButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  const wsd = useWSDAPI()
  const router = useRouter()

  async function handleLogout() {
    await wsd.auth.logout()
    router.push('/')
    toast('Successfully logged out.')
  }

  return (
    <Button onClick={handleLogout} {...buttonProps}>
      {children}
    </Button>
  )
}
