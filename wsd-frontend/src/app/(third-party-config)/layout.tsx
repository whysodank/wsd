import type { Metadata } from 'next'

import { getWSDMetadata } from '@/lib/metadata'
import { noopLayout } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({ noIndex: true })
}

export default noopLayout()
