'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'
import { Textarea } from '@/components/shadcn/textarea'

import { APIType, Includes } from '@/api'
import { useFormState } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'

export default function NewCommentForm({
  post,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
}) {
  const wsd = useWSDAPI()
  const router = useRouter()

  const {
    formState: commentState,
    resetFormState: resetCommentState,
    handleFormStateEvent: handleCommentStateEvent,
    formErrors: commentErrors,
    setFormErrors: setCommentErrors,
  } = useFormState<{
    comment: string
  }>({
    comment: '',
  })

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await wsd.createComment({ body: commentState.comment, post: post.id, user: '' })
    if (data.response.ok) {
      setCommentErrors({})
      resetCommentState()
      router.refresh()
    } else {
      setCommentErrors(data.error)
    }
  }

  return (
    <form className="mt-4 flex items-end gap-2 px-4 py-2" onSubmit={handleCommentSubmit}>
      <div className="relative flex-1">
        <Textarea
          placeholder="Add a comment..."
          name="comment"
          required
          onChange={handleCommentStateEvent('comment')}
          value={commentState.comment}
          errorText={commentErrors?.comment?.join('\n')}
        />
      </div>
      <Button variant="ghost" size="sm">
        Post
      </Button>
    </form>
  )
}
