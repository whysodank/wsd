'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'

import type { APIType, Includes } from '@/api'
import { useWSDAPI } from '@/lib/serverHooks'
import { cn, shortFormattedDateTime, uuidV4toHEX } from '@/lib/utils'

export function MemeComment({ comment }: { comment: Includes<APIType<'PostComment'>, 'user', APIType<'User'>> }) {
  const wsd = useWSDAPI()
  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(comment.vote)
  const [voteCount, setVoteCount] = useState((comment.positive_vote_count || 0) - (comment.negative_vote_count || 0))

  function handleVote(vote: APIType<'VoteEnum'>) {
    return async () => {
      let newVoteCount = voteCount
      let newFeedback

      if (feedback === vote) {
        newFeedback = null
        await wsd.unvotePostComment(comment.id)
        newVoteCount -= vote
      } else {
        newFeedback = vote
        if (feedback !== null) {
          newVoteCount -= feedback
        }

        if (vote === 1) {
          await wsd.upvotePostComment(comment.id)
        } else {
          await wsd.downvotePostComment(comment.id)
        }
        newVoteCount += vote
      }

      setFeedback(newFeedback)
      setVoteCount(newVoteCount)
    }
  }

  return (
    <article className="flex flex-row gap-2 p-4 rounded-lg bg-background w-full">
      <Avatar className="w-12 h-12 border rounded-full border-muted-foreground">
        <AvatarImage src={`https://robohash.org/${comment.user.username}/?size=96x96`} alt={comment.user.username} />
        <AvatarFallback>{Array.from(comment.user.username)[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2">
          <Link
            href={`/users/${uuidV4toHEX(comment.user.id)}`}
            className="text-sm font-semibold hover:underline text-foreground"
          >
            {comment.user.username}
          </Link>
          <div className="text-sm text-gray-500">
            <span>{shortFormattedDateTime(new Date(comment.created_at))}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{comment.body}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="link"
              size="sm"
              className="px-0 hover:text-accent-foreground hover:no-underline text-muted-foreground"
            >
              Reply
            </Button>
            <Button
              onClick={handleVote(1)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-transparent px-2"
              aria-label="Upvote"
            >
              <Icons.ArrowUp size={20} className={cn('h-5 w-5', feedback === 1 && 'text-green-500')} />
            </Button>
            <span className="text-sm font-medium text-muted-foreground min-w-[20px] text-center">{voteCount}</span>
            <Button
              onClick={handleVote(-1)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-transparent px-2"
              aria-label="Downvote"
            >
              <Icons.ArrowDown size={20} className={cn('h-5 w-5', feedback === -1 && 'text-destructive')} />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="More options">
              <Icons.MoreHorizontal size={18} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
