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
      if (feedback === vote) {
        setFeedback(null)
        await wsd.unvoteComment(comment.id)
        setVoteCount((prev) => prev - vote)
      } else {
        setFeedback(vote)
        if (feedback !== null) {
          setVoteCount((prev) => prev - feedback)
        }
        if (vote === 1) {
          await wsd.upvoteComment(comment.id)
        } else {
          await wsd.downvoteComment(comment.id)
        }
        setVoteCount((prev) => prev + vote)
      }
    }
  }

  return (
    <article className="flex flex-col gap-2 p-4 rounded-lg bg-background w-full">
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://robohash.org/${comment.user.username}/?size=96x96`} alt={comment.user.username} />
          <AvatarFallback>{Array.from(comment.user.username)[0]}</AvatarFallback>
        </Avatar>
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
      <p className="text-sm text-muted-foreground px-4 whitespace-pre-line">{comment.body}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          <Button
            onClick={handleVote(1)}
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            aria-label="Upvote"
          >
            <Icons.ArrowUp size={20} className={cn('h-5 w-5', feedback === 1 && 'text-green-500')} />
          </Button>
          <span className="text-sm font-medium text-muted-foreground min-w-[20px] text-center">{voteCount}</span>
          <Button
            onClick={handleVote(-1)}
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
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
    </article>
  )
}
