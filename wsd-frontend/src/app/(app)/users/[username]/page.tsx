import { notFound } from 'next/navigation'

import Memes from '@/components/wsd/Memes'
import UserProfile from '@/components/wsd/UserProfile'

import { APIQuery, APIType } from '@/api'
import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default async function User(props: {
  params: Promise<{ username: string }>
  searchParams?: Promise<APIQuery<'/v0/posts/'>>
}) {
  const { username } = await props.params
  const searchParams = await props.searchParams
  const wsd = sUseWSDAPI()
  const { data: users } = await wsd.users({ username })

  if (wsd.hasResults(users)) {
    const isAuthenticated = await wsd.isAuthenticated()
    const postQuery = {
      ...searchParams,
      user__username: username,
      page_size: config.ux.defaultPostPerPage,
      include: 'tags,user,category' as const,
      ordering: searchParams?.ordering || ('-created_at' as const),
    }
    const { data } = await wsd.posts(postQuery)
    return (
      <>
        <UserProfile user={wsd.getFirst(users) as APIType<'User'> | APIType<'PublicUser'>} />
        <Memes
          query={postQuery}
          initialPosts={data?.results || []}
          hasMorePages={Boolean(data?.total_pages && data.total_pages > 1)}
          isAuthenticated={isAuthenticated}
        />
      </>
    )
  }
  return notFound()
}
