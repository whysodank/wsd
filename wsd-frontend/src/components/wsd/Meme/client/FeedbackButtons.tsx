'use client'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'

import { APIType } from '@/api/typeHelpers'
import { useWSDAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'

export default function FeedbackButtons({ post }: { post: APIType<'Post'> }) {
  const wsd = useWSDAPI()
  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(post.vote)
  const [voteCount, setVoteCount] = useState((post.positive_vote_count || 0) - (post.negative_vote_count || 0))

  function handleVote(vote: APIType<'VoteEnum'>) {
    return async function () {
      if (feedback === vote) {
        setFeedback(null)
        await wsd.unvotePost(post.id)
        setVoteCount((prev) => prev - vote)
      } else {
        setFeedback(vote)
        if (feedback !== null) {
          setVoteCount((prev) => prev - feedback)
        }
        if (vote === 1) {
          await wsd.upvotePost(post.id)
        } else {
          await wsd.downvotePost(post.id)
        }
        setVoteCount((prev) => prev + vote)
      }
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
      <Button
        className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
        aria-label="Comment"
      >
        <Icons.MessageCircle size={20} />
        <span>{post.comment_count}</span>
      </Button>
    </>
  )
}
