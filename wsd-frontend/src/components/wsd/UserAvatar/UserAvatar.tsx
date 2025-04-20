import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'

import { APIType } from '@/api'
import { cn } from '@/lib/utils'

export function UserAvatar({ user, className }: { user: APIType<'User'> | APIType<'PublicUser'>; className?: string }) {
  return (
    <Avatar className={cn('w-24 h-24', className)}>
      <AvatarImage
        src={`https://robohash.org/wsd-${user?.username}/?size=96x96`}
        alt={user?.username}
        className="bg-white"
      />
      <AvatarFallback>{Array.from(user?.username)[0]}</AvatarFallback>
    </Avatar>
  )
}
