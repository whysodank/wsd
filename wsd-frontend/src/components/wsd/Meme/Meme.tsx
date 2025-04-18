'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { FeedbackButtons } from '@/components/wsd/Meme/client'

import { APIType, Includes } from '@/api'
import { useElementAttribute } from '@/lib/hooks'
import { cn, preventDefault, uuidV4toHEX } from '@/lib/utils'

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
  const [isExpanded, setIsExpanded] = useState(false)
  const { ref: imageRef, attributeValue: naturalHeight } = useElementAttribute<HTMLImageElement, 'naturalHeight'>(
    'naturalHeight'
  )

  const showExpandButton = !fullScreen && naturalHeight !== null && naturalHeight > 900 && !isExpanded
  const showShrinkButton = !fullScreen && naturalHeight !== null && naturalHeight > 900 && isExpanded

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
                ref={imageRef}
                src={post.image}
                alt={post.title}
                className={cn(
                  'relative h-auto object-cover object-top',
                  fullScreen ? 'w-full max-w-full' : ['lg:w-5/6', !isExpanded && 'max-h-[900px]']
                )}
                loading="lazy"
              />
            )}
            {(showExpandButton || showShrinkButton) && (
              <Button
                onClick={preventDefault(() => setIsExpanded(!isExpanded))}
                variant="ghost"
                className="z-10 w-8 h-8 absolute bottom-4 right-4 rounded-full p-2"
                aria-label={isExpanded ? 'Shrink' : 'Expand'}
              >
                {isExpanded ? <Icons.Minimize2 size={16} /> : <Icons.Maximize2 size={16} />}
              </Button>
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
                    'text-xs font-medium text-muted-foreground group-hover:text-secondary-foreground transition-colors'
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
