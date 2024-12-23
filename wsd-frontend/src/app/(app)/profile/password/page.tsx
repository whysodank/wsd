import type { Metadata } from 'next'

import Password from '@/components/wsd/Profile/Password'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function PasswordPage() {
  return <Password />
}
