import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/shadcn/sheet'
import { MobileNav } from '@/components/wsd/Header/MobileNav'
import { AdvancedSearch } from '@/components/wsd/Header/client'

import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function Header() {
  const wsd = sUseWSDAPI()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-primary">
      <div className="container flex h-14 items-center max-md:px-4 gap-2">
        <div className="xl:w-1/6">
          <Link prefetch={true} href={{ pathname: '/' }} className="items-center gap-2 hidden xl:flex">
            <span className="hidden font-bold lg:inline-block">{config.name}</span>
          </Link>
          <MobileNav />
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-center lg:w-1/2">
          <div className="w-3/4 max-md:w-full md:flex-none">
            <AdvancedSearch />
          </div>
        </div>
        <div className="xl:w-1/6 flex justify-end">
          {(await wsd.isAuthenticated()) ? (
            <Link prefetch={true} href={{ pathname: '/profile/details' }}>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 gap-2"
              >
                <Icons.User className="h-6 w-6" />
                <span className="max-xl:hidden">Profile</span>
              </Button>
            </Link>
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
