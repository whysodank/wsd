import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import _ from 'lodash'

import { Button, buttonVariants } from '@/components/shadcn/button'
import { Overlay, OverlayClose, OverlayContent, OverlayTitle, OverlayTrigger } from '@/components/shadcn/overlay'
import { Separator } from '@/components/shadcn/separator'
import Meme from '@/components/wsd/Meme'
import MemeComment from '@/components/wsd/MemeComment'
import NewComment from '@/components/wsd/NewComment'

import { APIQuery, APIType, includesType } from '@/api'
import { getWSDMetadata } from '@/lib/metadata'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'
import { getKeys } from '@/lib/typeHelpers'
import { InvalidHEXError, cn, hexToUUIDv4, suppress } from '@/lib/utils'

export async function generateMetadata(props: { params: Promise<{ hex: string }> }): Promise<Metadata | undefined> {
  const params = await props.params
  const wsd = sUseWSDAPI()
  const postId = suppress<string, undefined>([InvalidHEXError], () => hexToUUIDv4(params.hex))

  if (!_.isUndefined(postId)) {
    const { data: post } = await wsd.post(postId, { include: 'tags' })
    if (!_.isUndefined(post)) {
      const post_ = includesType(includesType(post as APIType<'Post'>, 'user', 'User'), 'tags', 'PostTag', true)
      return await getWSDMetadata({
        title: post_.title,
        description: post_.title,
      })
    }
  }
  return notFound()
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: { hex: string }
  searchParams: APIQuery<'/v0/post-comments/'>
}) {
  const wsd = sUseWSDAPI()
  const isAuthenticated = await wsd.isAuthenticated()
  const postId = suppress<string, undefined>([InvalidHEXError], () => hexToUUIDv4(params.hex))

  const orderingLabels = {
    created_at: 'Oldest',
    '-created_at': 'Newest',
    '-positive_vote_count': 'Most Liked',
    '-negative_vote_count': 'Most Disliked',
  }

  function newOrderingHREF(ordering: APIQuery<'/v0/post-comments/'>['ordering']) {
    return { pathname: `/posts/${params.hex}`, query: { ...searchParams, ordering } }
  }

  const currentOrdering = _.get(orderingLabels, searchParams.ordering || 'created_at', orderingLabels.created_at)

  if (!_.isUndefined(postId)) {
    const { data: post } = await wsd.post(postId, { include: 'tags,user' })
    if (!_.isUndefined(post)) {
      const { data: comments } = await wsd.postComments({
        post: post.id,
        include: 'user',
        ordering: searchParams?.ordering || 'positive_vote_count',
      })
      const post_ = includesType(includesType(post as APIType<'Post'>, 'user', 'User'), 'tags', 'PostTag', true)
      return (
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="w-4/5 min-h-[130vh]">
            <Meme post={post_} withTags fullScreen isAuthenticated={isAuthenticated} />
            <Separator className="max-sm:w-[calc(100%-8px)] w-full max-w-full" />
            {wsd.hasResults(comments) && (
              <Overlay breakpoint="md">
                <OverlayTrigger>
                  <Button variant="ghost" className="px-0 hover:bg-transparent">
                    <p className="font-medium text-muted-foreground hover:underline">Ordering: {currentOrdering}</p>
                  </Button>
                </OverlayTrigger>
                <OverlayContent align="start" side="bottom">
                  <OverlayTitle className="hidden">Ordering</OverlayTitle>
                  <div className="flex flex-col">
                    {getKeys(orderingLabels).map((key) => (
                      <OverlayClose key={key} asChild>
                        <Link
                          href={newOrderingHREF(key)}
                          className={cn(buttonVariants({ variant: 'ghost', className: 'w-full justify-start' }))}
                          scroll={false}
                        >
                          {orderingLabels[key]}
                        </Link>
                      </OverlayClose>
                    ))}
                  </div>
                </OverlayContent>
              </Overlay>
            )}
            {wsd.hasNoResult(comments) && (
              <div className="flex w-full justify-center items-center p-4 text-muted-foreground">
                Be the first one to comment!
              </div>
            )}
            {isAuthenticated && <NewComment post={post_} />}
            <div className="flex flex-col justify-center items-start">
              {wsd.hasResults(comments) &&
                comments.results.map((comment) => (
                  <MemeComment comment={includesType(comment, 'user', 'User')} key={`meme-comment-${comment.id}`} />
                ))}
            </div>
          </div>
        </div>
      )
    }
  }
  return notFound()
}
