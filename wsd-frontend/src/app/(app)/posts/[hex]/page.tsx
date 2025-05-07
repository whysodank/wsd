import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import MemePost, { generatePostAndCommentMetadata } from '@/components/wsd/MemePost/MemePost'

export async function generateMetadata(props: { params: Promise<{ hex: string }> }): Promise<Metadata> {
  return (await generatePostAndCommentMetadata(props)) ?? notFound()
}

export default async function PostPage(props: { params: Promise<{ hex: string }>; searchParams: Promise<any> }) {
  const postHex = (await props.params).hex
  const params = new Promise<{
    hex: string
    commentHex?: string
  }>((resolve) => {
    resolve({ hex: postHex, commentHex: undefined })
  })
  return <MemePost params={params} searchParams={props.searchParams} />
}
