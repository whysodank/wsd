import Memes from '@/components/wsd/Memes'

import { APIQuery } from '@/api'

export default async function Home({ searchParams }: { searchParams?: APIQuery<'/v0/posts/'> }) {
  return <Memes query={searchParams} />
}
