'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState, useTransition } from 'react'

import { Button } from '@/components/shadcn/button'
import UserAvatar from '@/components/wsd/UserAvatar'
import { WSDEditor, isEditorEmpty, stripEmptyParagraphs, useWSDEditor } from '@/components/wsd/WSDEditor'

import { APIType, Includes } from '@/api'
import { getWSDAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function NewCommentForm({
  post,
  user,
}: {
  post: Includes<Includes<APIType<'Post'>, 'user', APIType<'User'>>, 'tags', APIType<'PostTag'>[]>
  user: APIType<'User'>
}) {
  const wsd = getWSDAPI()
  const router = useRouter()
  const editor = useWSDEditor({})
  const [loading, setLoading] = useState(false)
  const [transitionIsPending, startTransition] = useTransition()

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (editor) {
      if (isEditorEmpty(editor)) {
        toast('Please enter a comment')
      } else {
        setLoading(true)
        try {
          const { response: commentResponse } = await wsd.createPostComment({
            body: stripEmptyParagraphs(editor.getJSON()),
            post: post.id,
          })
          if (commentResponse.ok) {
            editor.commands.clearContent(true)
            toast('Comment posted successfully')
            startTransition(() => router.refresh())
          } else {
            toast('Something went wrong, please try again later')
          }
        } catch (error) {
          toast('Something went wrong, please try again later')
          throw error
        }
        setLoading(false)
      }
    }
  }

  return (
    editor && (
      <form className="mt-4 flex items-end gap-2 px-4 py-2" onSubmit={handleCommentSubmit}>
        <Link href={{ pathname: `/users/${user?.username}` }} className="self-start">
          <UserAvatar user={user} className="w-12 h-12" />
        </Link>
        <div className="flex flex-col justify-end w-full gap-2">
          <div className="relative flex-1">
            <WSDEditor editor={editor || null} />
          </div>
          <Button
            variant="default"
            size="sm"
            className="max-w-16 self-end justify-self-end"
            disabled={loading || transitionIsPending || isEditorEmpty(editor)}
          >
            Post
          </Button>
        </div>
      </form>
    )
  )
}
