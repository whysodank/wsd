import Link from 'next/link'

import * as Icons from 'lucide-react'

import { GitHub } from '@/components/icons/brands'
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'
import Header from '@/components/wsd/Header'
import LeftColumn from '@/components/wsd/LeftColumn'
import RightColumn from '@/components/wsd/RightColumn'

import config from '@/config'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="contents">
        <div vaul-drawer-wrapper="">
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="border-b">
              <div className="container flex-1 items-start xl:grid xl:grid-cols-[240px_minmax(0,1fr)_240px] max-md:px-0">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100dvh-11rem)] w-full shrink-0 xl:sticky xl:block">
                  <ScrollArea className="h-full py-6 pr-6">
                    <LeftColumn />
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                  <div className="p-2 flex flex-col gap-1 items-start">
                    <Link
                      href={{ pathname: '/legal/privacy-policy' }}
                      className="text-muted-foreground text-sm hover:underline flex items-center gap-1 justify-between"
                    >
                      <Icons.Cookie size={18} className="mr-1" />
                      Privacy Policy
                    </Link>
                    <Link
                      href={{ pathname: '/legal/terms-of-service' }}
                      className="text-muted-foreground text-sm hover:underline flex items-center gap-1 justify-between"
                    >
                      <Icons.FileTextIcon size={18} className="mr-1" />
                      Terms of Service
                    </Link>
                    {config.githubLink && (
                      <Link
                        href={config.githubLink}
                        className="text-muted-foreground text-sm hover:underline flex items-center gap-1 justify-between"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GitHub className="w-5 h-5 mr-1" />
                        GitHub
                      </Link>
                    )}
                    <div className="flex flex-row gap-1">
                      <Link
                        className="text-muted-foreground text-sm hover:underline flex items-center gap-1 justify-between"
                        href={config.api.baseURL + '/v0/feeds/latest/rss/'}
                      >
                        <Icons.Rss color="darkorange" size={18} className="mr-1" />
                        RSS Feed
                      </Link>{' '}
                      /
                      <Link
                        className="text-muted-foreground text-sm hover:underline flex items-center gap-1 justify-between"
                        href={config.api.baseURL + '/v0/feeds/latest/rss/'}
                      >
                        Atom Feed
                      </Link>
                    </div>
                  </div>
                </aside>
                <main className="flex min-h-screen flex-col items-center pt-2">{children}</main>
                <aside className="fixed top-14 z-30 -mr-2 hidden h-[calc(100dvh-10rem)] w-full shrink-0 xl:sticky xl:block">
                  <ScrollArea className="h-full py-6 pl-6">
                    <RightColumn />
                  </ScrollArea>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
