import { NewCommentForm } from '@/components/wsd/NewComment/client'

import { APIType, Includes } from '@/api'
import { getWSDAPI } from '@/lib/serverHooks'

export async function NewComment({
  post,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
}) {
  const wsd = getWSDAPI()
  const user = (await wsd.getCurrentUser()) as APIType<'User'>
  return <NewCommentForm post={post} user={user} />
}
