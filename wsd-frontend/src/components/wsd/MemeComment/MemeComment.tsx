'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { ScrollToHashContainer } from '@/components/shadcn/scroll-to-hash-container'
import UserAvatar from '@/components/wsd/UserAvatar'
import { WSDEditorRenderer } from '@/components/wsd/WSDEditor/Editor'

import type { APIType, Includes } from '@/api'
import { useWSDAPI } from '@/lib/serverHooks'
import { InvalidHEXError, cn, shortFormattedDateTime, suppress, uuidV4toHEX } from '@/lib/utils'

import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

export function MemeComment({
  comment,
  targeted = false,
}: {
  comment: Includes<APIType<'PostComment'>, 'user', APIType<'User'>>
  targeted?: boolean
}) {
  const router = useRouter()

  const wsd = useWSDAPI()
  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(comment.vote)
  const [voteCount, setVoteCount] = useState((comment.positive_vote_count || 0) - (comment.negative_vote_count || 0))
  const postId = suppress<string, undefined>([InvalidHEXError], () => uuidV4toHEX(comment.post))
  const commentId = suppress<string, undefined>([InvalidHEXError], () => uuidV4toHEX(comment.id))

  function handleVote(vote: APIType<'VoteEnum'>) {
    return async () => {
      let newVoteCount = voteCount
      let newFeedback

      if (feedback === vote) {
        newFeedback = null
        newVoteCount -= vote
      } else {
        newFeedback = vote
        if (feedback !== null) {
          newVoteCount -= feedback
        }
        newVoteCount += vote
      }

      setFeedback(newFeedback)
      setVoteCount(newVoteCount)

      try {
        let response

        if (feedback === vote) {
          response = (await wsd.unvotePostComment(comment.id)).response
        } else {
          if (vote === 1) {
            response = (await wsd.upvotePostComment(comment.id)).response
          } else {
            response = (await wsd.downvotePostComment(comment.id)).response
          }
        }
        if (!response.ok) {
          setFeedback(feedback)
          setVoteCount(voteCount)
          toast('Error updating vote')
        }
      } catch {
        setFeedback(feedback)
        setVoteCount(voteCount)
        toast('Error updating vote')
      }
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this comment by ${comment.user.username}`,
          url: `${window.location.origin}/posts/${postId}/comment/${commentId}`,
        })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}/comment/${commentId}`)
        toast('Link copied to clipboard!')
      } else {
        // Fallback for browsers that don't support the Web Share API or Clipboard API
        console.log('Share API not supported')
        toast("Couldn't share the comment")
      }
    } catch (e) {
      console.log(e)
      toast("Couldn't share the comment")
    }
    router.push(`/posts/${postId}/comment/${commentId}`, { scroll: false })
  }

  return (
    <ScrollToHashContainer shouldScroll={targeted} className={'w-full'} offset={10}>
      <article
        className={cn(
          'flex flex-row gap-2 p-4 rounded-lg bg-background w-full',
          targeted && 'border-2 border-accent bg-black'
        )}
      >
        <Link href={{ pathname: `/users/${comment.user.username}` }}>
          <UserAvatar user={comment.user} className="w-12 h-12" />
        </Link>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <Link
              href={`/users/${comment.user.username}`}
              className="text-sm font-semibold hover:underline text-foreground"
            >
              {comment.user.username}
            </Link>
            <span className="text-sm text-gray-500" title={shortFormattedDateTime(new Date(comment.created_at))}>
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-line">
            <WSDEditorRenderer content={comment.body as object} />
          </div>
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
                <Icons.ArrowBigUp size={20} className={cn(feedback === 1 && 'text-green-500 fill-green-500')} />
              </Button>
              <span className="text-sm font-medium text-muted-foreground min-w-[20px] text-center">{voteCount}</span>
              <Button
                onClick={handleVote(-1)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-transparent px-2"
                aria-label="Downvote"
              >
                <Icons.ArrowBigDown size={20} className={cn(feedback === -1 && 'text-destructive fill-destructive')} />
              </Button>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-transparent px-2"
                aria-label="Share"
              >
                <Icons.Link size={16} />
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
    </ScrollToHashContainer>
  )
}
