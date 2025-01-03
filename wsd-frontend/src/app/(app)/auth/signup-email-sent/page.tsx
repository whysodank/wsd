import type { Metadata } from 'next'

import SignupEmailSent from '@/components/wsd/Auth/SignupEmailSent'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default async function SignupEmailSentPage() {
  return <SignupEmailSent />
}
