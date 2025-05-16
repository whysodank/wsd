'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useCallback, useEffect, useState } from 'react'

import _ from 'lodash'

import { buttonVariants } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import { Skeleton } from '@/components/shadcn/skeleton'
import Meme, { RelaxedMeme } from '@/components/wsd/Meme'

import { APIQuery, APIType, includesType } from '@/api'
import config from '@/config'
import { useEffectAfterMount } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'

import { useInView } from 'react-intersection-observer'

export function Memes({
  query,
  initialPosts,
  hasMorePages,
  isAuthenticated = false,
  cardStyle = 'NORMAL',
}: {
  query?: Omit<APIQuery<'/v0/posts/'>, 'include' | 'page'>
  initialPosts?: APIType<'Post'>[]
  hasMorePages?: boolean
  isAuthenticated?: boolean
  cardStyle?: APIType<'CardStyleEnum'>
}) {
  const wsd = useWSDAPI()
  const searchParams = useSearchParams()

  const defaultQuery = { page_size: config.ux.defaultPostPerPage }
  const alwaysQuery = {
    include: cardStyle === 'RELAXED' ? 'tags,user,category,comments' : 'tags,user,category',
  } as const

  const [posts, setPosts] = useState<APIType<'Post'>[]>(initialPosts || [])
  const [page, setPage] = useState(initialPosts && hasMorePages ? 2 : 1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { ref: loaderRef, inView } = useInView({ threshold: 1 })

  async function fetchPosts(pageNum: number, resetPosts = false) {
    setLoading(true)
    const fullQuery = {
      ...defaultQuery,
      ...query,
      ...alwaysQuery,
      page: pageNum,
    } as APIQuery<'/v0/posts/'>

    const { data: postsData } = await wsd.posts(fullQuery)
    setPosts((prev) => {
      const newPosts = resetPosts ? postsData?.results || [] : [...prev, ...(postsData?.results || [])]
      return _.uniqBy(newPosts, 'id')
    })
    setHasMore(page !== postsData?.total_pages)
    setLoading(false)
  }

  useEffectAfterMount(() => {
    setLoading(true)
    setHasMore(true)
    setPage(1)
    fetchPosts(1, true)
  }, [searchParams])

  useEffect(() => {
    if (initialPosts && hasMorePages) {
      fetchPosts(page)
    } else {
      setHasMore(false)
      setLoading(false)
    }
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps -- We rerender on page change, fetchPosts is not needed

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1)
    }
  }, [inView, hasMore, loading])

  const memeCard = useCallback(
    (post: APIType<'Post'>) => {
      const includedBasePost = includesType(includesType(post, 'user', 'User'), 'tags', 'PostTag', true)
      if (cardStyle === 'RELAXED') {
        const includeRelaxedPost = includesType(includedBasePost, 'comments', 'PostComment', true)
        return <RelaxedMeme post={includeRelaxedPost} withTags withRepostData isAuthenticated={isAuthenticated} />
      }
      if (cardStyle === 'NORMAL') {
        return <Meme post={includedBasePost} withTags withRepostData isAuthenticated={isAuthenticated} />
      }
    },
    [cardStyle, isAuthenticated]
  )

  return (
    <div className="flex flex-col gap-2 items-center md:min-w-[840px] w-full">
      {posts.map((post) => (
        <div className="contents" key={post.id}>
          {memeCard(post)}
          <Separator className="max-sm:w-[calc(100%-8px)] w-5/6" />
        </div>
      ))}
      {loading && (
        <div className="w-5/6 max-md:w-full p-4">
          <Skeleton className="w-full h-1 rounded-md" />
        </div>
      )}
      {!loading && !hasMore && (
        <div className="w-5/6 max-md:w-full p-4 flex flex-col items-center justify-center gap-2">
          <p>There are no more memes, maybe try changing filters?</p>
          <Link href={{ pathname: '/create-post/' }} className={cn(buttonVariants({ variant: 'default' }))}>
            Or maybe post your own?
          </Link>
        </div>
      )}
      <div ref={loaderRef} className="h-10 w-full" />
    </div>
  )
}
