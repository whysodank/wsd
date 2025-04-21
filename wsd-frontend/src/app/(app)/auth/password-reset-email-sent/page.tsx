import type { Metadata } from 'next'

import PasswordResetEmailSent from '@/components/wsd/Auth/PasswordResetEmailSent'

import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({ noIndex: true })
}

export default async function PasswordResetEmailSentPage() {
  return <PasswordResetEmailSent />
}
