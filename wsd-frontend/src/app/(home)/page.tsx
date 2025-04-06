import Memes from '@/components/wsd/Memes'

import { APIQuery } from '@/api'
import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default async function Home({ searchParams }: { searchParams?: APIQuery<'/v0/posts/'> }) {
  const wsd = sUseWSDAPI()
  const isAuthenticated = await wsd.isAuthenticated()
  const { data } = await wsd.posts({
    ...searchParams,
    page_size: config.ux.defaultPostPerPage,
    include: 'tags,user,category',
  })
  return (
    <Memes
      query={searchParams}
      initialPosts={data?.results || []}
      hasMorePages={Boolean(data?.total_pages && data.total_pages > 1)}
      isAuthenticated={isAuthenticated}
    />
  )
}
