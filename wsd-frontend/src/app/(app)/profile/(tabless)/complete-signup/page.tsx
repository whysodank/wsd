import type { Metadata } from 'next'

import CompleteSignup from '@/components/wsd/Profile/CompleteSignup'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function DetailsPage() {
  return <CompleteSignup />
}
