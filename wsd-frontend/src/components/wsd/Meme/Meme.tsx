// Can't make this server component for some reason -- is it because the Memes component loads the memes in the
// frontend? Because of the infinite scroll?
import Link from 'next/link'

import * as Icons from 'lucide-react'

import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { FeedbackButtons } from '@/components/wsd/Meme/client'

import { APIType, Includes } from '@/api'
import { cn, uuidV4toHEX } from '@/lib/utils'

export function Meme({
  post,
  withTags = false,
  fullScreen = false,
  isAuthenticated = false,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
  withTags?: boolean
  fullScreen?: boolean
  isAuthenticated?: boolean
}) {
  return (
    <article
      className={cn(
        'shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md w-5/6 max-md:w-full',
        fullScreen && 'max-w-full w-full'
      )}
    >
      <div className="flex flex-col gap-1 p-4 max-md:p-2 max-md:py-0">
        <h2 className="text-xl font-semibold">
          <Link className="hover:underline break-word" href={{ pathname: `/posts/${uuidV4toHEX(post.id)}/` }}>
            {post.title}
          </Link>
        </h2>
        <Link className="hover:underline break-word" href={{ pathname: `/posts/${uuidV4toHEX(post.id)}/` }}>
          <div className="relative w-full flex justify-center items-center bg-black overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                // backgroundImage: `url(${post.image})`,
                backgroundColor: 'black',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
              }}
            ></div>
            <div className="absolute inset-0 bg-black/60"></div>
            {!isAuthenticated && post.is_nsfw ? (
              <AspectRatio ratio={16 / 9} className="text-white">
                <div className="flex h-full w-full items-center justify-center">
                  <h1 className="text-4xl font-bold uppercase tracking-wider">NSFW</h1>
                </div>
              </AspectRatio>
            ) : (
              <img
                src={post.image}
                alt={post.title}
                className={cn(
                  'relative z-10 lg:w-5/6 max-w-[80%] h-auto max-md:max-w-full',
                  fullScreen ? 'max-w-full w-full' : 'max-h-[900px]'
                )}
                loading="lazy"
              />
            )}
          </div>
        </Link>
        {withTags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.name} variant="outline" className="px-3 py-1 text-sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FeedbackButtons post={post} isAuthenticated={isAuthenticated} />
            <Button
              className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
              aria-label="Share"
            >
              <Icons.Share2 size={20} />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
              aria-label="More"
            >
              <Icons.Ellipsis size={20} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
