import React from 'react'

import Header from '@/components/wsd/Header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="contents">
        <div vaul-drawer-wrapper="">
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="border-b">
              <div>
                <main className="flex min-h-screen flex-col items-center pt-2">{children}</main>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
