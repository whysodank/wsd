import type { Metadata } from 'next'
import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Card, CardContent } from '@/components/shadcn/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import Logout from '@/components/wsd/Profile/Logout'

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

  const { data } = await wsd.auth.session()
  const sessionData = data?.data as { user: { username: string } }
  const username = sessionData?.user?.username

  const profileTabs = [
    { name: 'Profile', href: '/profile/details', icon: Icons.User },
    { name: 'Password', href: '/profile/password', icon: Icons.Lock },
    { name: 'Emails', href: '/profile/emails', icon: Icons.Mail },
    { name: 'Connections', href: '/profile/connections', icon: Icons.Link },
  ]

  return (
    <div className="min-h-screen flex flex-col gap-1 items-center justify-center p-4">
      {username && (
        <div className="flex flex-col justify-center items-center gap-1">
          <Avatar className="w-24 h-24">
            <AvatarImage src={`https://robohash.org/${username}/?size=96x96`} alt={username} />
            <AvatarFallback>{Array.from(username)[0]}</AvatarFallback>
          </Avatar>
          <Link href={{ pathname: '/users/username' }} className="hover:underline">
            {username}
          </Link>
        </div>
      )}
      <div className="flex flex-col justify-center items-center mb-36 w-full">
        <Card className="w-full max-w-xl">
          <CardContent className="p-6 flex flex-col gap-4">
            <Tabs>
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
        <Logout />
      </div>
    </div>
  )
}
