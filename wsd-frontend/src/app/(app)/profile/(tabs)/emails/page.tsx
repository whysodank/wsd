import type { Metadata } from 'next'

import Emails from '@/components/wsd/Profile/Emails'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function EmailsPage() {
  return <Emails />
}
