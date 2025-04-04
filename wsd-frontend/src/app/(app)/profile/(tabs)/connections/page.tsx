import type { Metadata } from 'next'

import Connections from '@/components/wsd/Profile/Connections'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function ConnectionsPage() {
  return <Connections />
}
