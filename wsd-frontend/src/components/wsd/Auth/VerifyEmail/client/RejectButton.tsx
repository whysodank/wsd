'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { toast } from 'sonner'

export default function RejectButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  const router = useRouter()

  async function handleReject() {
    toast('Email verification rejected.', { description: "You don't need to do anything else." })
    router.push('/')
  }

  return (
    <Button onClick={handleReject} {...buttonProps}>
      {children}
    </Button>
  )
}
