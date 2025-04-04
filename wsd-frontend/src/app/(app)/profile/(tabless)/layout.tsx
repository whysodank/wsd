import type { Metadata } from 'next'

import React from 'react'

import { Card, CardContent } from '@/components/shadcn/card'
import LogoutButton from '@/components/wsd/LogoutButton'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col gap-1 items-center justify-center p-4">
      <div className="flex flex-col justify-center items-center mb-36 w-full gap-2">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 flex flex-col gap-4">{children}</CardContent>
        </Card>
        <LogoutButton className="w-full gap-2" variant="link">
          Logout
        </LogoutButton>
      </div>
    </div>
  )
}
