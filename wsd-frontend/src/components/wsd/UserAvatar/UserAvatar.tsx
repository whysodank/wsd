import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'

import { APIType } from '@/api'
import { cn } from '@/lib/utils'

export function UserAvatar({ user, className }: { user: APIType<'User'> | APIType<'PublicUser'>; className?: string }) {
  return (
    <Avatar className={cn('w-24 h-24', className)}>
      <AvatarImage src={user.avatar || undefined} alt={user.username} className="bg-white" />
      <AvatarFallback>{Array.from(user?.username)[0]}</AvatarFallback>
    </Avatar>
  )
}
