import type { Metadata } from 'next'

import SignupEmailSent from '@/components/wsd/Auth/SignupEmailSent'

import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({ noIndex: true })
}

export default async function SignupEmailSentPage() {
  return <SignupEmailSent />
}
