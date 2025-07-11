'use client'

import { useRouter } from 'next/navigation'

import { SetStateAction, useEffect, useRef, useState, useTransition } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import FileInputButton, { FileInputButtonRef } from '@/components/shadcn/file-input-button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RawSVGIcon } from '@/components/shadcn/raw-svg-icon'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Switch } from '@/components/shadcn/switch'

import { APIType } from '@/api'
import { fileToBase64 } from '@/lib/fileUtils'
import { useFileDragDrop, useFilePaste, useFormState } from '@/lib/hooks'
import { getWSDAPI } from '@/lib/serverHooks'
import { cn, uuidV4toHEX } from '@/lib/utils'

import { Tag, TagInput } from 'emblor'
import { toast } from 'sonner'

export default function NewPostForm({ categories }: { categories: APIType<'PostCategory'>[] }) {
  const wsd = getWSDAPI()
  const router = useRouter()
  const fileInputRef = useRef<FileInputButtonRef>(null)

  const [tags, setTags] = useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [transitionIsPending, startTransition] = useTransition()

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

  // Use the useFilePaste hook to handle image paste
  const { files: pastedFiles, error: pasteError } = useFilePaste({
    acceptedTypes: ['image/*'],
    enabled: true,
  })

  // Process pasted files whenever they change
  useEffect(() => {
    if (pastedFiles.length > 0 && fileInputRef.current) {
      const imageFile = pastedFiles[0]
      fileInputRef.current.setFile(imageFile)
      toast.success('Image pasted successfully!')
    }
  }, [pastedFiles])

  useEffect(() => {
    if (pasteError) {
      toast.error(pasteError)
    }
  }, [pasteError])

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
    original_source: string
    is_original: boolean
    is_nsfw: boolean
    tags: string[]
  }>({
    title: '',
    category: '',
    image: '',
    original_source: '',
    is_original: false,
    is_nsfw: false,
    tags: [],
  })

  async function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    try {
      const { data: postData, response: postResponse, error: postError } = await wsd.createPost(postState)

      if (postResponse.ok) {
        setPostErrors({})
        resetPostState()
        startTransition(() => router.push(`/posts/${uuidV4toHEX(postData?.id as string)}`))
        setLoading(false)
      } else {
        if (postResponse.status === 413) {
          setPostErrors({ image: ['File too large. Please upload a smaller file.'] })
        } else {
          setPostErrors(postError)
        }
        setLoading(false)
      }
    } catch {
      setLoading(false)
      toast('Something went wrong, please try again.')
    }
  }

  // Implement useFileDragDrop hook for better drag and drop handling
  const { ref: dragDropRef, isDragging } = useFileDragDrop<HTMLFormElement>({
    onDrop: async (droppedFiles) => {
      if (droppedFiles.length > 0) {
        const file = droppedFiles[0]
        // Check if it's an image
        if (file.type.startsWith('image/')) {
          fileInputRef.current?.setFile(file)
          toast('Image selected successfully!')
        } else {
          toast.error('Please upload an image file')
        }
      }
    },
    acceptedFileTypes: ['image/*'],
    multiple: false,
  })

  return (
    <form className="flex items-end gap-2 w-full justify-center" onSubmit={handleCreatePost} ref={dragDropRef}>
      <div
        className={cn(
          'fixed inset-0 bg-black/25 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300',
          isDragging ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex flex-column bg-primary p-4 rounded-lg shadow-lg gap-2">
          <Icons.Upload size={24} className="text-black" />
          <p className="text-black text-lg font-semibold">Drop your image here</p>
        </div>
      </div>
      <div className="bg-background p-6 w-full sm:w-4/5 md:w-4/5 lg:w-3/5 xl:w-2/5">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Create Post</h1>
          <div className="flex flex-col gap-2">
            <Label htmlFor="postTitle">Post Title</Label>
            <Input
              id="postTitle"
              placeholder="Title"
              name="title"
              value={postState.title}
              onChange={handlePostStateEvent('title')}
              errorText={postErrors?.title?.join('\n')}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-autocomplete="none"
            />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="postCategory">Category</Label>
              <Select value={postState.category} onValueChange={handlePostStateValue('category')} name="category">
                <SelectTrigger className="w-full" id="postCategory">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem
                        value={category.id}
                        key={category.name}
                        ref={(ref) => {
                          // Bugfix for mobile devices ( see #9 )
                          if (!ref) return
                          ref.ontouchstart = (e) => {
                            e.preventDefault()
                          }
                        }}
                      >
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
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="postMedia" className="flex gap-2">
              <Icons.Shell size={16} />
              Meme
            </Label>
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-12 text-center',
                isDragging && 'border-primary bg-primary/10'
              )}
            >
              <div className="flex flex-col items-center gap-4">
                {!fileInputRef.current?.hasFile() && (
                  <>
                    <div className="p-4 bg-muted rounded-full">
                      <Icons.Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">
                      Choose, paste or drag and drop a photo to upload or drag and drop here
                    </p>
                  </>
                )}
                <FileInputButton onFileSelect={onFileSelect} ref={fileInputRef} id="postMedia" />
              </div>
            </div>
            {postErrors?.image?.join('\n') && (
              <span className="text-sm text-destructive whitespace-pre-line">{postErrors?.image?.join('\n')}</span>
            )}
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="postOriginalSource" className="flex gap-2">
                <Icons.Link size={16} />
                Original Source
              </Label>
              <Input
                id="postOriginalSource"
                type="url"
                placeholder="https://"
                name="title"
                value={postState.original_source}
                onChange={handlePostStateEvent('original_source')}
                errorText={postErrors?.original_source?.join('\n')}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-autocomplete="none"
              />
            </div>
            <small className="text-muted-foreground">Meme's youtube/reddit/blog link</small>
          </div>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="is_nsfw">I made this</Label>
              <Switch
                id="is_original"
                checked={postState.is_original}
                onCheckedChange={handlePostStateValue('is_original')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="is_nsfw">NSFW</Label>
              <Switch id="is_nsfw" checked={postState.is_nsfw} onCheckedChange={handlePostStateValue('is_nsfw')} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="postTags" className="flex gap-2">
              <Icons.Tag size={16} />
              Tags
            </Label>
            <TagInput
              id="postTags"
              placeholder="Add some tags"
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              tags={tags}
              setTags={setPostTags}
              styleClasses={{ tag: { body: 'pl-2' }, input: 'h-full' }}
              maxTags={5}
              maxLength={20}
            />
          </div>
          <div className="flex justify-end">
            <Button className="w-full" disabled={loading || transitionIsPending}>
              {loading || transitionIsPending ? (
                <div className="w-full flex justify-center gap-2 animate-pulse">
                  <span>Creating...</span>
                </div>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
