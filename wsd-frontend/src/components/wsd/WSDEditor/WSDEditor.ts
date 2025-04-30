import { cn } from '@/lib/utils'

import { WSDMention, WSDMentionSSR } from './WSDMentionsExtension'
import { JSONContent } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import { Link } from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import { Placeholder } from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import { generateHTML } from '@tiptap/html'
import { Editor, useEditor } from '@tiptap/react'

export function isEditorEmpty(editor?: Editor | null) {
  if (!editor) {
    return true
  }
  const json = editor.getJSON()
  if (!json.content || json.content.length === 0 || editor.isEmpty) {
    return true
  }

  return json.content.every((node) => {
    if (!node.content || node.content.length === 0) {
      return true
    }

    return node.content.every((child) => {
      if (child.type === 'text') {
        return !child.text?.trim()?.length
      }
      return false
    })
  })
}

export function stripEmptyParagraphs(json: JSONContent): JSONContent {
  /*
  @TODO: We need to clear the user input
  - Remove empty trailing/leading paragraphs and spaces
  - Remove empty consecutive empty paragraphs and spaces from inside the content
  - Always have exactly one space before and after links and mentions
    There is no built-in way to do this in tiptap, so we need to do it manually
   */
  return json
}

export function useWSDEditor({ content, editable = true }: { content?: object; editable?: boolean }) {
  return useEditor(
    {
      immediatelyRender: false,
      editable,
      extensions: [
        Document,
        Text,
        Paragraph,
        HardBreak,
        History,
        Typography,
        Link,
        WSDMention,
        Placeholder.configure({ placeholder: 'Write something...' }),
      ],
      editorProps: {
        attributes: {
          class: cn(
            'prose prose-sm ProseMirror',
            'text-sm text-muted-foreground !w-full !max-w-full',
            editable ? 'min-h-32 border rounded-md border-muted-foreground' : '!p-0'
          ),
        },
      },
      content,
    },
    [content]
  )
}

export function getWSDEditorHTML({ content }: { content: JSONContent }) {
  return generateHTML(content, [Document, Text, Paragraph, WSDMentionSSR])
}
