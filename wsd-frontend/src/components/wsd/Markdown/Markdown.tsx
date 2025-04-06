'use server'

import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'

export async function Markdown({ content }: { content: string }) {
  const window = new JSDOM('').window
  const purify = DOMPurify(window)
  const parsedHtml = purify.sanitize(await marked.parse(content))

  return (
    <div>
      <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: parsedHtml }} />
    </div>
  )
}
