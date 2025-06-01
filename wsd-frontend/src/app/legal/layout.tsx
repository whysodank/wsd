import Link from 'next/link'

import React from 'react'

import { Card, CardContent } from '@/components/shadcn/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'

export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  const legalTabs = [
    { name: 'Terms of Service', href: '/legal/terms-of-service' },
    { name: 'Privacy Policy', href: '/legal/privacy-policy' },
  ]

  return (
    <div className="min-h-screen flex flex-col gap-1 items-center justify-center p-4">
      <div className="flex flex-col justify-center items-center mb-36 w-full gap-2">
        <Tabs defaultValue={legalTabs[0].href} className="max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            {legalTabs.map((tab) => (
              <TabsTrigger key={tab.href} value={tab.href} asChild>
                <Link href={tab.href} prefetch={true} className="flex gap-2">
                  <span className="flex">{tab.name}</span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6 flex flex-col gap-4">{children}</CardContent>
        </Card>
        <Link prefetch={true} href={{ pathname: '/' }} className="hover:underline">
          Back to Website
        </Link>
      </div>
    </div>
  )
}
