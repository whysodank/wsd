import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import _ from 'lodash'

import MemePost from '@/components/wsd/MemePost/MemePost'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'
import { InvalidHEXError, hexToUUIDv4, suppress } from '@/lib/utils'

export async function generateMetadata(props: { params: Promise<{ hex: string }> }): Promise<Metadata | undefined> {
  const params = await props.params
  const wsd = sUseWSDAPI()
  const postId = suppress<string, undefined>([InvalidHEXError], () => hexToUUIDv4(params.hex))

  if (!_.isUndefined(postId)) {
    const { data: post } = await wsd.post(postId, { include: 'tags' })
    if (!_.isUndefined(post)) {
      return await getWSDMetadata({
        title: post.title,
        description: post.title,
        image: post.is_nsfw ? config.nsfw_image : post.image,
      })
    }
  }
  return notFound()
}

export default async function PostPage(props: { params: Promise<{ hex: string }>; searchParams: Promise<any> }) {
  const postHex = (await props.params).hex
  const params = new Promise<{
    hex: string
    commentHex?: string
  }>((resolve) => {
    resolve({ hex: postHex, commentHex: undefined })
  })
  return <MemePost params={params} searchParams={props.searchParams} />
}
