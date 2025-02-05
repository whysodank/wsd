import { Separator } from '@/components/shadcn/separator'
import Meme from '@/components/wsd/Meme'

import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default async function Home() {
  const wsd = sUseWSDAPI()
  const { data } = await wsd.posts({ page_size: config.ux.defaultPostPerPage })
  return (
    <div className="flex flex-col gap-2 items-center">
      {data?.results.map((post) => (
        <>
          <Meme post={post} key={`meme-${post.id}`} />
          <Separator className="max-sm:w-[calc(100%-8px)] w-5/6" key={`sep-${post.id}`} />
        </>
      ))}
    </div>
  )
}
