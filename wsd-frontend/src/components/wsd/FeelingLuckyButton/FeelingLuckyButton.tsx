'use client'

import { useRouter } from 'next/navigation'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'

import { getWSDAPI } from '@/lib/serverHooks'
import { uuidV4toHEX } from '@/lib/utils'

import { toast } from 'sonner'

export default function FeelingLuckyButton() {
  const wsd = getWSDAPI()
  const route = useRouter()

  const handleClick = async () => {
    const { data: post } = await wsd.getRandomPost()
    if (post) {
      route.push(`/posts/${uuidV4toHEX(post.id)}`)
    } else {
      toast('No posts found.')
    }
  }

  return (
    <Button onClick={handleClick} className="flex gap-2" variant="ghost" size={'sm'}>
      <Icons.Clover size={16} /> Feeling Lucky
    </Button>
  )
}
