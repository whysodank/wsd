'use client'

import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
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
    const data = await wsd.createPostComment({ body: commentState.comment, post: post.id })
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
      <Avatar className="w-12 h-12 border rounded-full border-muted-foreground self-start">
        <AvatarImage src={`https://robohash.org/todo-current-user/?size=96x96`} alt="todo-current-user" />
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-end w-full gap-2">
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
        <Button variant="default" size="sm" className="max-w-16 self-end justify-self-end">
          Post
        </Button>
      </div>
    </form>
  )
}
