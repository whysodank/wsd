import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import _ from 'lodash'

import MemePost from '@/components/wsd/MemePost/MemePost'

import { includesType } from '@/api'
import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'
import { InvalidHEXError, hexToUUIDv4, suppress } from '@/lib/utils'

export async function generateMetadata(props: {
  params: Promise<{ hex: string; commentHex?: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const wsd = sUseWSDAPI()
  const postId = suppress<string, undefined>([InvalidHEXError], () => hexToUUIDv4(params.hex))
  const commentParamId = params.commentHex

  if (!_.isUndefined(postId)) {
    const { data: post } = await wsd.post(postId, { include: 'tags' })
    if (!_.isUndefined(post)) {
      if (!_.isUndefined(commentParamId)) {
        const commentId = suppress<string, undefined>([InvalidHEXError], () => hexToUUIDv4(commentParamId))
        if (!_.isUndefined(commentId)) {
          const { data: comment } = await wsd.postComment(commentId, { include: 'user' })
          if (!_.isUndefined(comment)) {
            const commentData = includesType(comment, 'user', 'User')

            // @TODO: Handle comment body
            return await getWSDMetadata({
              title: `${commentData.user.username} - commented on ${post.title}`,
              image: post.is_nsfw ? config.nsfw_image : post.image,
            })
          } else {
            return notFound()
          }
        }
      }

      return await getWSDMetadata({
        title: post.title,
        description: post.title,
        image: post.is_nsfw ? config.nsfw_image : post.image,
      })
    }
  }
  return notFound()
}

export default async function CommentPostPage(props: {
  params: Promise<{ hex: string; commentHex: string }>
  searchParams: Promise<any>
}) {
  return <MemePost params={props.params} searchParams={props.searchParams} />
}
