import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'
import { Separator } from '@/components/shadcn/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/shadcn/sheet'
import LeftColumn from '@/components/wsd/LeftColumn'

import config from '@/config'
import { cn } from '@/lib/utils'

export async function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'px-0 text-base hover:bg-transparent focus-visible:bg-transparent',
            'focus-visible:ring-0 focus-visible:ring-offset-0 xl:hidden'
          )}
        >
          <Icons.Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-2">
        <SheetHeader>
          <SheetTitle className="absolute left-4 top-3 rounded-sm opacity-70 flex flex-row gap-2 align-center">
            <Icons.Shell size={24} />
            {config.name}
          </SheetTitle>
          <SheetDescription className="hidden">Categories</SheetDescription>
          <Separator className="!mt-4" />
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-4rem)] pr-0">
          <LeftColumn />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
