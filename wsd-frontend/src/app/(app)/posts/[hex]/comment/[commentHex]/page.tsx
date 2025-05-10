import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import MemePost, { generatePostAndCommentMetadata } from '@/components/wsd/MemePost/MemePost'

export async function generateMetadata(props: {
  params: Promise<{ hex: string; commentHex: string }>
}): Promise<Metadata> {
  return (await generatePostAndCommentMetadata(props)) ?? notFound()
}

export default async function CommentPostPage(props: {
  params: Promise<{ hex: string; commentHex: string }>
  searchParams: Promise<any>
}) {
  console.log('OMMENT')
  return <MemePost params={props.params} searchParams={props.searchParams} />
}
