'use client'

import * as Icons from 'lucide-react'

import * as Popover from '@radix-ui/react-popover'

import { Button } from '@/components/shadcn/button'

import { APIType, Includes } from '@/api'

import { toast } from 'sonner'

export default function MemeThreeDotMenu({
  post,
}: {
  post?: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
}) {
  const actions = [
    {
      label: 'Download',
      icon: Icons.Download,
      action: async () => {
        if (!post?.image) return

        try {
          // Create an Image element to load the image
          const img = new Image()
          img.crossOrigin = 'anonymous' // Handle CORS

          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = post.image
          })

          // Create canvas and context
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            throw new Error('Could not get canvas context')
          }

          // Draw image to canvas
          ctx.drawImage(img, 0, 0)

          // Convert to PNG
          canvas.toBlob((blob) => {
            if (!blob) {
              throw new Error('Could not generate blob')
            }

            // Create download URL and trigger download
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = `wsd_meme.png`
            document.body.appendChild(link)
            link.click()
            toast('Successfully downloaded the meme', {
              important: true,
            })
            // Cleanup
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)
          }, 'image/png')
        } catch (error) {
          console.error('Failed to download image:', error)
          toast('Failed to download the meme', {
            important: true,
          })
          // You might want to add error handling/notification here
        }
      },
    },
  ]
  return (
    <Popover.Root>
      <Popover.Anchor>
        <Popover.Trigger>
          <a
            className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-secondary bg-transparent"
            aria-label="More"
          >
            <Icons.Ellipsis size={20} />
          </a>
        </Popover.Trigger>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[150px] bg-black p-1 shadow-md"
          align="start" // This aligns to the left
          side="bottom" // This positions the popover below the trigger
        >
          {actions.map((action) => (
            <Button
              variant={'ghost'}
              key={action.label}
              onClick={action.action}
              className="w-full flex items-center px-3 py-1 text-sm text-muted-foreground rounded-none"
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
