'use server'

import Link from 'next/link'

import { Card, CardContent } from '@/components/shadcn/card'
import ProfileTabsList from '@/components/wsd/Profile/ProfileTabsList/client'
import UserAvatar from '@/components/wsd/UserAvatar'

import { APIType } from '@/api'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const wsd = sUseWSDAPI()

  const { data: user } = await wsd.me()

  return (
    <div className="min-h-screen flex flex-col gap-1 items-center justify-center p-4">
      <div className="flex flex-col justify-center items-center gap-1">
        <UserAvatar user={user as APIType<'User'>} className="w-24 h-24" />
        <Link href={{ pathname: `/users/${user?.username}` }} className="hover:underline">
          {user?.username}
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center mb-36 w-full gap-2">
        <Card className="w-full max-w-xl">
          <CardContent className="p-6 flex flex-col gap-4">
            <ProfileTabsList />
            {children}
          </CardContent>
        </Card>
        <Link prefetch={true} href={{ pathname: '/' }} className="hover:underline">
          Back to the website?
        </Link>
      </div>
    </div>
  )
}
