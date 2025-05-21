'use client'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { APIType, Includes } from '@/api'
import { downloadAndFormatImage } from '@/lib/fileUtils'

import { toast } from 'sonner'

export default function MemeThreeDotMenu({
  post,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
}) {
  const actions = [
    {
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
    },
  ]

  return (
    <Overlay breakpoint="md">
      <OverlayTrigger>
        <a
          className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-secondary bg-transparent"
          aria-label="More"
        >
          <Icons.Ellipsis size={20} />
        </a>
      </OverlayTrigger>
      <OverlayContent
        className="z-50 min-w-[50px] w-full md:w-fit bg-black p-1 shadow-md rounded-md"
        popoverContentProps={{
          align: 'center',
          side: 'bottom',
        }}
        side="bottom"
      >
        {actions.map((action) => (
          <Button
            variant={'ghost'}
            key={action.label}
            onClick={action.action}
            className="w-full flex items-center px-3 py-1 text-sm text-muted-foreground rounded-md focus-visible:ring-0 focus-visible:ring-offset-0
"
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </OverlayContent>
    </Overlay>
  )
}
