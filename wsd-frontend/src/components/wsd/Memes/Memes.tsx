import { Separator } from '@/components/shadcn/separator'
import Meme from '@/components/wsd/Meme'

import { APIQuery, includesType } from '@/api'
import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export { includesType } from '@/api/typeHelpers'

export async function Memes({ query }: { query?: Omit<APIQuery<'/v0/posts/'>, 'include'> }) {
  const wsd = sUseWSDAPI()
  const defaultQuery = { page_size: config.ux.defaultPostPerPage }
  const alwaysQuery = { include: 'tags,user,category' }
  const userQuery = { ...defaultQuery, ...query, ...alwaysQuery }
  const { data } = await wsd.posts(userQuery as APIQuery<'/v0/posts/'>)

  return (
    <div className="flex flex-col gap-2 items-center min-w-[840px]">
      {data?.results?.map((post) => (
        <div className="contents" key={post.id}>
          <Meme post={includesType(includesType({ ...post }, 'user', 'User'), 'tags', 'PostTag', true)} withTags />
          <Separator className="max-sm:w-[calc(100%-8px)] w-5/6" />
        </div>
      ))}
    </div>
  )
}
