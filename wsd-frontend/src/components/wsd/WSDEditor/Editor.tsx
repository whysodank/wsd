'use client'

import { getWSDEditorHTML } from './WSDEditor'
import { JSONContent } from '@tiptap/core'
import { EditorContent, Editor as TipTapEditor } from '@tiptap/react'

export function WSDEditorRenderer({ content }: { content: JSONContent }) {
  const html = getWSDEditorHTML({ content })
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="prose prose-sm ProseMirror text-sm text-muted-foreground !w-full !max-w-full !p-0"
    />
  )
}

export function WSDEditor({ editor }: { editor?: TipTapEditor | null }) {
  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} className="tiptap-editor w-full" />
}
