'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'

import { APIType, Includes } from '@/api'
import { useWSDAPI } from '@/lib/serverHooks'
import { forcedType } from '@/lib/typeHelpers'
import { cn, shortFormattedDateTime, uuidV4toHEX } from '@/lib/utils'

import { formatDistanceToNow } from 'date-fns'

export function Notification({ notification }: { notification: APIType<'Notification'> }) {
  const wsd = useWSDAPI()
  const router = useRouter()

  const [isRead, setIsRead] = useState(notification.is_read)

  useEffect(() => {
    if (notification.is_read) {
      setIsRead(notification.is_read)
    }
  }, [notification.is_read])

  const icons = {
    LIKE: Icons.Heart,
    COMMENT: Icons.MessageSquare,
    COMMENT_MENTION: Icons.AtSign,
  }
  const NotificationIcon = icons[notification.event] || Icons.Shell

  type PostNotificationT = Includes<APIType<'Notification'>, 'object_of_interest', APIType<'Post'>>
  type PostCommentNotificationT = Includes<
    APIType<'Notification'>,
    'object_of_interest',
    Includes<APIType<'PostComment'>, 'post', APIType<'Post'>>
  >

  function getPostHREF() {
    let postID: string | undefined

    if (notification.object_of_interest_type === 'Post') {
      postID = forcedType<PostNotificationT>(notification).object_of_interest.id
    } else if (notification.object_of_interest_type === 'PostComment') {
      postID = forcedType<PostCommentNotificationT>(notification).object_of_interest.post.id
    }
    return (postID && { pathname: `/posts/${uuidV4toHEX(postID)}` }) || {}
  }

  const postImage = useMemo(() => {
    let image: string | undefined

    if (notification.object_of_interest_type === 'Post' && 'image' in notification.object_of_interest) {
      image = forcedType<PostNotificationT>(notification).object_of_interest.image
    } else if (
      notification.object_of_interest_type === 'PostComment' &&
      'image' in forcedType<PostCommentNotificationT>(notification).object_of_interest.post
    ) {
      image = forcedType<PostCommentNotificationT>(notification).object_of_interest.post.image
    }
    return image
  }, [notification])

  async function handleClick() {
    await wsd.patchNotification(notification.id, { is_read: true })
    setIsRead(true)
    router.refresh()
  }

  async function handleClickRead(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    e.preventDefault()
    const newIsRead = !isRead
    await wsd.patchNotification(notification.id, { is_read: newIsRead })
    setIsRead(newIsRead)
  }

  return (
    <div className="transition-colors cursor-pointer hover:bg-muted/50 rounded-xl p-4 flex flex-col gap-2 relative">
      <Link href={getPostHREF()} onClick={handleClick}>
        <div className="flex items-center gap-2">
          <NotificationIcon className="h-4 w-4 text-muted-foreground" />
          <span
            title={shortFormattedDateTime(new Date(notification.created_at))}
            className="text-xs text-muted-foreground"
          >
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground text-left">{notification.description}</p>
          {postImage && (
            <img
              src={postImage}
              alt="Notification Object Of Interest Preview"
              className="h-10 w-10 object-cover rounded-sm text-right"
            />
          )}
        </div>
      </Link>
      <div className="absolute top-2 right-4 gap-1 flex items-center justify-center">
        <Button
          onClick={handleClickRead}
          className="p-0.5 h-full  items-center rounded-md transition-colors text-gray-500 hover:bg-secondary bg-transparent z-10"
          aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
        >
          <Icons.Check size={18} className={cn(!isRead ? 'text-gray-500' : 'text-green-400')} />
        </Button>
        {!isRead && <span className="h-3 w-3 rounded-full bg-red-600 border" />}
      </div>
    </div>
  )
}
