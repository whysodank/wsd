import Link from 'next/link'

import * as React from 'react'

import { cn } from '@/lib/utils'

// TODO@next15: Remove forwardRef and turn this back to a function component
// Currently we need the forwardRef for SheetClose and PopoverClose to work
export const CategoryLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    icon?: React.ReactNode
    children: React.ReactNode
  }
>(({ children, icon, className, ...props }, ref) => {
  return (
    <Link
      prefetch={true}
      ref={ref}
      className={cn(
        'rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent',
        'focus:text-accent-foreground focus:outline-none text-muted-foreground w-full flex',
        'justify-between items-center break-all gap-2 transition-colors',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {icon}
        <span>{children}</span>
      </div>
    </Link>
  )
})

CategoryLink.displayName = 'CategoryLink'
