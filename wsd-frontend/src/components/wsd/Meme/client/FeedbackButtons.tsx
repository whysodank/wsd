'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { buttonVariants } from '@/components/shadcn/button'
import AuthenticatedOnlyActionButton from '@/components/wsd/AuthenticatedOnlyActionButton'

import { APIType, Includes } from '@/api/typeHelpers'
import { useWSDAPI } from '@/lib/serverHooks'
import { cn, uuidV4toHEX } from '@/lib/utils'

export default function FeedbackButtons({
  post,
  isAuthenticated,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
  isAuthenticated: boolean
}) {
  const wsd = useWSDAPI()
  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(post.vote)
  const [voteCount, setVoteCount] = useState((post.positive_vote_count || 0) - (post.negative_vote_count || 0))
  const [isBookmarked, setIsBookmarked] = useState<boolean>(post.bookmarked)

  async function handleBookmark() {
    setIsBookmarked(!isBookmarked)
    await (isBookmarked ? wsd.unbookmarkPost.bind(wsd) : wsd.bookmarkPost.bind(wsd))(post.id)
  }

  function handleVote(vote: APIType<'VoteEnum'>) {
    return async function () {
      let newVoteCount = voteCount
      let newFeedback

      if (feedback === vote) {
        newFeedback = null
        await wsd.unvotePost(post.id)
        newVoteCount -= vote
      } else {
        newFeedback = vote
        if (feedback !== null) {
          newVoteCount -= feedback
        }

        if (vote === 1) {
          await wsd.upvotePost(post.id)
        } else {
          await wsd.downvotePost(post.id)
        }

        newVoteCount += vote
      }

      setFeedback(newFeedback)
      setVoteCount(newVoteCount)
    }
  }

  return (
    <div className="flex gap-1 flex-row items-center justify-center">
      <AuthenticatedOnlyActionButton
        onClick={handleVote(1)}
        className="flex items-center p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
        aria-label="Upvote"
        isAuthenticated={isAuthenticated}
      >
        <Icons.ArrowBigUp size={24} className={cn(feedback === 1 && 'text-green-500 fill-green-500')} />
      </AuthenticatedOnlyActionButton>
      <span className="font-medium text-gray-500">{voteCount}</span>
      <AuthenticatedOnlyActionButton
        onClick={handleVote(-1)}
        className="flex items-center p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
        aria-label="Downvote"
        isAuthenticated={isAuthenticated}
      >
        <Icons.ArrowBigDown size={24} className={cn(feedback === -1 && 'text-destructive fill-destructive')} />
      </AuthenticatedOnlyActionButton>
      <Link
        href={{ pathname: `/posts/${uuidV4toHEX(post.id)}/` }}
        className={cn(
          buttonVariants({
            variant: 'default',
            className:
              'flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent',
          })
        )}
        aria-label="Comment"
      >
        <Icons.MessageCircleMore size={20} />
        <span>{post.comment_count}</span>
      </Link>
      <AuthenticatedOnlyActionButton
        onClick={handleBookmark}
        className={cn(
          'flex items-center p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent'
        )}
        aria-label="Bookmark"
        isAuthenticated={isAuthenticated}
      >
        <Icons.Heart size={20} className={cn(isBookmarked && 'text-blue-500 fill-blue-500')} />
      </AuthenticatedOnlyActionButton>
    </div>
  )
}
