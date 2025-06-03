'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'

export function ProfileTabsList() {
  const currentPath = usePathname()
  const [tabs] = useState([
    { name: 'Profile', href: '/profile/details', icon: Icons.User },
    { name: 'Password', href: '/profile/password', icon: Icons.Lock },
    { name: 'Emails', href: '/profile/emails', icon: Icons.Mail },
    { name: 'Connections', href: '/profile/connections', icon: Icons.Link },
  ])
  const defaultValue = tabs[0].href

  return (
    <Tabs defaultValue={defaultValue} value={currentPath} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.href} value={tab.href} asChild>
            <Link href={tab.href} prefetch={true} className="flex gap-2">
              <tab.icon className="h-5 w-5" />
              <span className="hidden sm:flex">{tab.name}</span>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
