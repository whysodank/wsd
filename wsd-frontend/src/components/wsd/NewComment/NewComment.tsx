import { NewCommentForm } from '@/components/wsd/NewComment/client'

import { APIType, Includes } from '@/api'

export async function NewComment({
  post,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
}) {
  return <NewCommentForm post={post} />
}
