import type { Metadata } from 'next'

import PasswordResetEmailSent from '@/components/wsd/Auth/PasswordResetEmailSent'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default async function PasswordResetEmailSentPage() {
  return <PasswordResetEmailSent />
}
