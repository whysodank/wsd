'use client'

import { useRouter } from 'next/navigation'

import * as React from 'react'
import { SetStateAction, useState } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import FileInputButton from '@/components/shadcn/file-input-button'
import { Input } from '@/components/shadcn/input'
import { RawSVGIcon } from '@/components/shadcn/raw-svg-icon'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

import { APIType } from '@/api'
import { useFormState } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'
import { fileToBase64, uuidV4toHEX } from '@/lib/utils'

import { Tag, TagInput } from 'emblor'

export default function NewPostForm({ categories }: { categories: APIType<'PostCategory'>[] }) {
  const wsd = useWSDAPI()
  const router = useRouter()

  const [tags, setTags] = useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)

  function setPostTags(input: SetStateAction<Tag[]>) {
    setTags((prevTags) => {
      const newTags = typeof input === 'function' ? input(prevTags) : input
      handlePostStateValue('tags')(_.map(newTags, 'text'))
      return newTags
    })
  }

  async function onFileSelect(file: File | null) {
    if (file) {
      handlePostStateValue('image')(await fileToBase64(file))
    }
  }

  const {
    formState: postState,
    resetFormState: resetPostState,
    handleFormStateEvent: handlePostStateEvent,
    handleFormStateValue: handlePostStateValue,
    formErrors: postErrors,
    setFormErrors: setPostErrors,
  } = useFormState<{
    title: string
    category: string
    image: string
    tags: string[]
  }>({
    title: '',
    category: '',
    image: '',
    tags: [],
  })

  async function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { data: postData, response: postResponse, error: postError } = await wsd.createPost(postState)
    if (postResponse.ok) {
      setPostErrors({})
      resetPostState()
      router.push(`/posts/${uuidV4toHEX(postData?.id as string)}`)
    } else {
      setPostErrors(postError)
    }
  }

  return (
    <form className="flex items-end gap-2 w-full justify-center" onSubmit={handleCreatePost}>
      <div className="bg-background p-6 w-2/5 max-m:w-full">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Create Post</h1>
          <Input
            placeholder="Title"
            name="title"
            value={postState.title}
            onChange={handlePostStateEvent('title')}
            errorText={postErrors?.title?.join('\n')}
          />
          <>
            <Select value={postState.category} onValueChange={handlePostStateValue('category')} name="category">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem value={category.id} key={category.name}>
                      <div className="flex flex-row gap-2 items-center">
                        <RawSVGIcon svg={category.icon} />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {postErrors?.category?.join('\n') && (
              <span className="text-sm text-destructive whitespace-pre-line">{postErrors?.category?.join('\n')}</span>
            )}
          </>
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <Icons.Image className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium">Choose a photo to upload</p>
              <FileInputButton onFileSelect={onFileSelect} />
            </div>
          </div>
          <TagInput
            placeholder="Add some tags"
            activeTagIndex={activeTagIndex}
            setActiveTagIndex={setActiveTagIndex}
            tags={tags}
            setTags={setPostTags}
            styleClasses={{ tag: { body: 'pl-2' }, input: 'h-full' }}
            maxTags={5}
            maxLength={20}
          />
          <div className="flex justify-end">
            <Button variant="outline" className="w-full">
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
