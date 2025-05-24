'use server'

import '~/src/app/globals.css'

import type { Metadata } from 'next'

import { Toaster } from '@/components/shadcn/sonner'

import MonkeyPatches from '@/app/monkeypatches'
import { PWARegister } from '@/app/pwaRegister'
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09090B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WSD" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <title>{config.motto}</title>
        {gaID && <GoogleAnalytics gaId={gaID} />}
        <PWARegister />
      </head>
      <body className="min-h-screen font-sans antialiased dark">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
