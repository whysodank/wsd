import { Separator } from '@/components/shadcn/separator'
import Meme from '@/components/wsd/Meme'

import { includesType } from '@/api'
import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export { includesType } from '@/api/typeHelpers'

export default async function Home() {
  const wsd = sUseWSDAPI()
  const { data } = await wsd.posts({ page_size: config.ux.defaultPostPerPage, include: 'tags,user' })
  return (
    <div className="flex flex-col gap-2 items-center">
      {data?.results.map((post) => (
        <div className="contents" key={post.id}>
          <Meme post={includesType(includesType({ ...post }, 'user', 'User'), 'tags', 'PostTag', true)} />
          <Separator className="max-sm:w-[calc(100%-8px)] w-5/6" />
        </div>
      ))}
    </div>
  )
}
