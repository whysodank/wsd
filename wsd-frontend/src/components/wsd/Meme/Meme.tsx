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
  withRepostData = false,
  fullScreen = false,
  isAuthenticated = false,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
  withTags?: boolean
  withRepostData?: boolean
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
            />
            <div className="absolute inset-0 bg-black/60" />
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
          <div className="flex flex-wrap gap-2 py-2">
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
          </div>
          <div className="flex items-center gap-4">
            {withRepostData && post.initial && (
              <Badge
                variant="outline"
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 transition-all',
                  'hover:bg-secondary hover:text-secondary-foreground',
                  'border border-border/50 rounded-full shadow-sm',
                  'cursor-pointer group'
                )}
              >
                <Icons.Share2
                  size={14}
                  className="text-muted-foreground group-hover:text-secondary-foreground transition-colors"
                />
                <Link
                  href={`/posts/${uuidV4toHEX(post.initial)}/`}
                  className={cn(
                    'text-xs font-medium text-muted-foreground',
                    'group-hover:text-secondary-foreground transition-colors'
                  )}
                >
                  View original post
                </Link>
              </Badge>
            )}
            <Button
              className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-secondary bg-transparent"
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
