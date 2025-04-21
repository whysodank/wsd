'use server'

import '~/src/app/globals.css'

import type { Metadata } from 'next'

import { Toaster } from '@/components/shadcn/sonner'

import MonkeyPatches from '@/app/monkeypatches'
import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

import { GoogleAnalytics } from '@next/third-parties/google'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata()
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaID = config.devtools.googleAnalytics.gaID
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MonkeyPatches />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
        {gaID && <GoogleAnalytics gaId={gaID} />}
      </head>
      <body className="min-h-screen font-sans antialiased dark">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
