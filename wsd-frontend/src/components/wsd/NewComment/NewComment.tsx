import { NewCommentForm } from '@/components/wsd/NewComment/client'

import { APIType, Includes } from '@/api'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function NewComment({
  post,
}: {
  post: Includes<
    Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>,
    'category',
    APIType<'PostCategory'>
  >
}) {
  const wsd = sUseWSDAPI()
  const user = (await wsd.getCurrentUser()) as APIType<'User'>
  return <NewCommentForm post={post} user={user} />
}
