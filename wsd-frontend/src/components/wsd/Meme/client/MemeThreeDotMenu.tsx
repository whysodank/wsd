'use client'

import { useMemo } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { APIType, Includes } from '@/api'
import { downloadAndFormatImage } from '@/lib/fileUtils'
import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function MemeThreeDotMenu({
  post,
  currentUser,
  onDelete,
  onRestore,
}: {
  post: Includes<
    Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>,
    'category',
    APIType<'PostCategory'>
  >
  currentUser?: APIType<'User'> | null
  onDelete?: (postId: string) => void
  onRestore?: (postId: string) => void
}) {
  const wsd = getWSDAPI()
  // Move the condition checks into individual useMemo hooks
  const canDelete = useMemo(() => {
    if (post.is_hidden) return false
    return currentUser?.id === post.user.id || currentUser?.is_superuser === true
  }, [currentUser?.id, currentUser?.is_superuser, post.is_hidden, post.user.id])

  const canRestore = useMemo(() => {
    if (!post.is_hidden) return false
    return currentUser?.is_superuser === true
  }, [currentUser?.is_superuser, post.is_hidden])

  const downloadAction = useMemo(
    () => ({
      label: 'Download',
      icon: Icons.Download,
      action: async () => {
        try {
          await downloadAndFormatImage(post.image, `${post.title}.png`, 'image/png', 1)
          toast('Image downloaded successfully')
        } catch {
          toast('Unknown error downloading image')
        }
      },
    }),
    [post.image, post.title]
  )

  const hideAction = useMemo(
    () =>
      ((!post.is_hidden && canDelete) || (post.is_hidden && canRestore)) && {
        label: post.is_hidden ? 'Restore' : 'Hide',
        icon: post.is_hidden ? Icons.Eye : Icons.EyeClosed,
        action: async () => {
          if (post.is_hidden) {
            await wsd.unHidePost(post.id)
            onRestore?.(post.id)
          } else {
            await wsd.hidePost(post.id)
            onDelete?.(post.id)
          }
        },
      },
    [post.is_hidden, post.id, canDelete, canRestore, wsd, onRestore, onDelete]
  )

  const actions = useMemo(() => _.compact([downloadAction, hideAction]), [downloadAction, hideAction])

  return (
    <Overlay breakpoint="md">
      <OverlayTrigger>
        <Button
          variant="ghost"
          className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-secondary bg-transparent"
          aria-label="More"
        >
          <Icons.Ellipsis size={20} />
        </Button>
      </OverlayTrigger>
      <OverlayContent
        className="z-50 min-w-[50px] w-full md:w-fit bg-black p-1 shadow-md rounded-md"
        popoverContentProps={{
          align: 'end',
          side: 'bottom',
        }}
        side="bottom"
      >
        {actions.map((action) => (
          <Button
            variant={'ghost'}
            key={action.label}
            onClick={action.action}
            className="w-full flex items-center px-3 py-1 text-sm text-muted-foreground rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </OverlayContent>
    </Overlay>
  )
}
