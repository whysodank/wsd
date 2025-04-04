import type { Metadata } from 'next'
import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Card, CardContent } from '@/components/shadcn/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import UserAvatar from '@/components/wsd/UserAvatar'

import { APIType } from '@/api'
import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const wsd = sUseWSDAPI()

  const { data: user } = await wsd.me()

  const profileTabs = [
    { name: 'Profile', href: '/profile/details', icon: Icons.User },
    { name: 'Password', href: '/profile/password', icon: Icons.Lock },
    { name: 'Emails', href: '/profile/emails', icon: Icons.Mail },
    { name: 'Connections', href: '/profile/connections', icon: Icons.Link },
  ]

  return (
    <div className="min-h-screen flex flex-col gap-1 items-center justify-center p-4">
      <div className="flex flex-col justify-center items-center gap-1">
        <UserAvatar user={user as APIType<'User'>} className="w-24 h-24" />
        <Link href={{ pathname: '/users/username' }} className="hover:underline">
          {user?.username}
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center mb-36 w-full gap-2">
        <Card className="w-full max-w-xl">
          <CardContent className="p-6 flex flex-col gap-4">
            <Tabs defaultValue={profileTabs[0].href}>
              <TabsList className="grid w-full grid-cols-4">
                {profileTabs.map((tab) => (
                  <TabsTrigger key={tab.href} value={tab.href} asChild>
                    <Link href={tab.href} prefetch={true} className="flex gap-2">
                      <tab.icon className="h-5 w-5" />
                      <span className="hidden sm:flex">{tab.name}</span>
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
