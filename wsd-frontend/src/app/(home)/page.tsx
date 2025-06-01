import BackToTopButton from '@/components/wsd/BackToTopButton/client'
import Memes from '@/components/wsd/Memes'

import { APIQuery } from '@/api'
import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default async function Home(props: { searchParams?: Promise<APIQuery<'/v0/posts/'>> }) {
  const searchParams = await props.searchParams
  const wsd = sUseWSDAPI()
  const isAuthenticated = await wsd.isAuthenticated()
  const postQuery = {
    ...searchParams,
    page_size: config.ux.defaultPostPerPage,
    include: 'tags,user,category' as const,
    ordering: searchParams?.ordering || ('-created_at' as const),
  }
  const { data } = await wsd.posts(postQuery)
  return (
    <>
      <Memes
        query={postQuery}
        initialPosts={data?.results || []}
        hasMorePages={Boolean(data?.total_pages && data.total_pages > 1)}
        isAuthenticated={isAuthenticated}
      />
      <BackToTopButton />
    </>
  )
}
