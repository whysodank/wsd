'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { APIType } from '@/api'
import { useWSDAPI } from '@/lib/serverHooks'
import { uuidV4toHEX } from '@/lib/utils'

import { formatDistanceToNow } from 'date-fns'

export function Notification({ notification }: { notification: APIType<'Notification'> }) {
  const wsd = useWSDAPI()
  const router = useRouter()

  const [isRead, setIsRead] = useState(notification.is_read)

  const icons = {
    LIKE: Icons.Heart,
    COMMENT: Icons.MessageSquare,
  }
  const NotificationIcon = icons[notification.event] || Icons.Shell

  function getPostHREF(notificationObject: APIType<'Notification'>) {
    let postID: string | undefined
    if (notification.object_of_interest_type === 'Post') {
      postID = notificationObject.object_of_interest.id as string
    } else if (notification.object_of_interest_type === 'PostComment') {
      postID = (notification.object_of_interest as APIType<'PostComment'>).post as string
    }
    return (postID && { pathname: `/posts/${uuidV4toHEX(postID)}` }) || {}
  }

  async function handleClick() {
    await wsd.patchNotification(notification.id, { is_read: true })
    setIsRead(true)
    router.refresh()
  }

  return (
    <Link
      className="transition-colors cursor-pointer hover:bg-muted/50 rounded-xl p-4 flex flex-col gap-2 relative"
      href={getPostHREF(notification)}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <NotificationIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground text-left">{notification.description}</p>
        {notification.object_of_interest && 'image' in notification.object_of_interest && (
          <img
            src={notification.object_of_interest.image}
            alt="Notification Object Of Interest Preview"
            className="h-10 w-10 object-cover rounded-sm text-right"
          />
        )}
      </div>
      {!isRead && <span className="absolute top-2.5 right-2.5 h-3 w-3 rounded-full bg-red-600 border" />}
    </Link>
  )
}
