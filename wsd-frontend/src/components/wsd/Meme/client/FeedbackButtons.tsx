'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Button, buttonVariants } from '@/components/shadcn/button'

import { APIType, Includes } from '@/api/typeHelpers'
import { useWSDAPI } from '@/lib/serverHooks'
import { cn, uuidV4toHEX } from '@/lib/utils'

export default function FeedbackButtons({
  post,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
}) {
  const wsd = useWSDAPI()
  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(post.vote)
  const [voteCount, setVoteCount] = useState((post.positive_vote_count || 0) - (post.negative_vote_count || 0))

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
    <>
      <Button
        onClick={handleVote(1)}
        className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
        aria-label="Upvote"
      >
        <Icons.ArrowUp size={20} className={cn('h-5 w-5', feedback === 1 && 'text-green-500')} />
      </Button>
      <span className="font-medium text-gray-500">{voteCount}</span>
      <Button
        onClick={handleVote(-1)}
        className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
        aria-label="Downvote"
      >
        <Icons.ArrowDown size={20} className={cn('h-5 w-5', feedback === -1 && 'text-destructive')} />
      </Button>
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
        <Icons.MessageCircle size={20} />
        <span>{post.comment_count}</span>
      </Link>
      <Button
        className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
        aria-label="Bookmark"
      >
        <Icons.Heart size={20} />
      </Button>
    </>
  )
}
