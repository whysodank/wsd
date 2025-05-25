'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { FeedbackButtons, MemeThreeDotMenu } from '@/components/wsd/Meme/client'
import UserAvatar from '@/components/wsd/UserAvatar'

import { APIType, Includes } from '@/api'
import { useElementAttributes } from '@/lib/hooks'
import { cn, preventDefault, shortFormattedDateTime, uuidV4toHEX } from '@/lib/utils'

import { formatDistanceToNow } from 'date-fns'

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
  const [isBlurred, setIsBlurred] = useState(true)
  const { ref: imageRef, attributeValues: meme } = useElementAttributes<
    HTMLImageElement,
    'naturalHeight' | 'offsetWidth' | 'naturalWidth'
  >(['naturalHeight', 'offsetWidth', 'naturalWidth'])

  const scale = meme.offsetWidth && meme.naturalWidth ? meme.offsetWidth / meme.naturalWidth : 1
  const scaledHeight = meme.naturalHeight ? meme.naturalHeight * scale : null

  const showExpandButton = !fullScreen && scaledHeight !== null && scaledHeight > 900 && !isExpanded
  const showShrinkButton = !fullScreen && scaledHeight !== null && scaledHeight > 900 && isExpanded

  const shouldApplyBlur = post.is_nsfw && isAuthenticated && isBlurred

  function handleNSFWClick() {
    if (post.is_nsfw && isAuthenticated) {
      setIsBlurred(false)
    }
  }

  function handleReBlur() {
    if (post.is_nsfw && isAuthenticated) {
      setIsBlurred(true)
    }
  }

  const originalSource = post.initial ? `/posts/${uuidV4toHEX(post.initial)}/` : post.original_source || undefined

  return (
    <article
      className={cn(
        'shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md w-5/6 max-md:w-full',
        fullScreen && 'max-w-full w-full'
      )}
    >
      <div className="flex flex-col gap-1 p-4 max-md:p-2 max-md:py-0">
        <div className="flex items-center gap-2">
          <Link href={{ pathname: `/users/${post.user.username}` }}>
            <UserAvatar user={post.user} className="w-6 h-6" />
          </Link>
          <Link
            href={{ pathname: `/users/${post.user.username}/` }}
            className="text-xs text-muted-foreground hover:underline"
            target="_blank"
          >
            {post.user.username}
          </Link>
          <span className="text-xs text-muted-foreground">•</span>
          <span title={shortFormattedDateTime(new Date(post.created_at))} className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>
        <h2 className="text-xl font-semibold">
          <Link className="hover:underline break-word" href={{ pathname: `/posts/${uuidV4toHEX(post.id)}/` }}>
            {post.title}
          </Link>
        </h2>
        <Link className="hover:underline break-word" href={{ pathname: `/posts/${uuidV4toHEX(post.id)}/` }}>
          <div className="relative w-full flex justify-center items-center bg-black overflow-hidden">
            <div className="absolute inset-0 bg-black/60" />
            {!isAuthenticated && post.is_nsfw ? (
              <AspectRatio ratio={16 / 9} className="text-white">
                <div className="flex h-full w-full items-center justify-center">
                  <h1 className="text-4xl font-bold uppercase tracking-wider">NSFW</h1>
                </div>
              </AspectRatio>
            ) : (
              <div className="relative w-full flex justify-center">
                <img
                  ref={imageRef}
                  src={post.image}
                  alt={post.title}
                  className={cn(
                    'relative h-auto object-cover object-top transition-all duration-300',
                    fullScreen ? 'w-full max-w-full' : ['lg:w-5/6 w-full', !isExpanded && 'max-h-[900px]'],
                    shouldApplyBlur && 'blur-xl'
                  )}
                  loading="lazy"
                />
                {shouldApplyBlur && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    onClick={preventDefault(() => handleNSFWClick())}
                  >
                    <div className="p-4 bg-black/70 rounded-md text-white cursor-pointer">
                      <h3 className="text-xl font-bold uppercase">NSFW</h3>
                      <p className="text-sm">Click to reveal</p>
                    </div>
                  </div>
                )}
                {post.is_nsfw && isAuthenticated && !isBlurred && (
                  <Button
                    onClick={preventDefault(() => handleReBlur())}
                    variant="secondary"
                    className="z-10 absolute top-4 right-4 text-xs py-1 px-2 h-auto text-md flex gap-2"
                    aria-label="Reblur NSFW content"
                  >
                    <Icons.EyeOff size={20} />
                    <span>Blur</span>
                  </Button>
                )}
              </div>
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
            {withRepostData && originalSource && (
              <Link
                href={originalSource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted-foreground group-hover:text-secondary-foreground transition-colors"
              >
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
                  <span className="text-xs font-medium text-muted-foreground">Source</span>
                </Badge>
              </Link>
            )}

            <MemeThreeDotMenu post={post} />
          </div>
        </div>
      </div>
    </article>
  )
}
