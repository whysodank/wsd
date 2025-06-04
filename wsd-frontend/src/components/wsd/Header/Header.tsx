import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Button, buttonVariants } from '@/components/shadcn/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/shadcn/sheet'
import { MobileNav } from '@/components/wsd/Header/MobileNav'
import Notifications from '@/components/wsd/Notifications'
import UserAvatar from '@/components/wsd/UserAvatar'

import { APIType } from '@/api'
import config from '@/config'
import { getWSDAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'

export async function Header() {
  const wsd = getWSDAPI()
  const user = (await wsd.getCurrentUser()) as APIType<'User'>
  const { data: notifications } = await wsd.notifications({ is_read: false })

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-primary">
      <div className="container flex h-12 items-center max-md:px-4 gap-2">
        <div className="xl:w-1/6">
          <Link prefetch={true} href={{ pathname: '/' }} className="items-center gap-2 hidden xl:flex">
            <span className="hidden font-bold lg:flex gap-2 flex-row">
              <Icons.Shell size={24} />
              {config.name}
            </span>
          </Link>
          <MobileNav />
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-center lg:w-1/2">
          <div className="w-3/4 max-md:w-full md:flex-none" />
        </div>
        <div className="xl:w-1/6 flex justify-end gap-1 items-center">
          {(await wsd.isAuthenticated()) ? (
            <>
              <Link
                href={{ pathname: `/create-post/` }}
                prefetch={true}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                    className: 'flex gap-2 h-10 w-10 rounded-full p-2',
                  })
                )}
                aria-label="New Post"
              >
                <Icons.Plus size={20} className="h-6 w-6" />
              </Link>
              <Notifications hasNew={wsd.hasResults(notifications)} />
              <Link
                prefetch={true}
                href={{ pathname: '/profile/details' }}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    className: 'p-2 focus-visible:ring-0 focus-visible:ring-offset-0 gap-2 rounded-full h-10 w-10',
                  })
                )}
              >
                <UserAvatar user={user} className="w-8 h-8" />
              </Link>
            </>
          ) : (
            <>
              <div className="hidden lg:contents">
                <Link prefetch={true} href={{ pathname: '/auth/login' }}>
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link prefetch={true} href={{ pathname: '/auth/signup' }}>
                  <Button variant="ghost">Sign Up</Button>
                </Link>
              </div>
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                    >
                      <Icons.User className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetHeader className="hidden">
                    <SheetDescription className="hidden">Account</SheetDescription>
                  </SheetHeader>
                  <SheetTitle className="hidden">Account</SheetTitle>
                  <SheetContent side="bottom" className="px-2 flex flex-col">
                    <Link prefetch={true} href={{ pathname: '/auth/login' }}>
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link prefetch={true} href={{ pathname: '/auth/signup' }}>
                      <Button variant="ghost">Sign Up</Button>
                    </Link>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
