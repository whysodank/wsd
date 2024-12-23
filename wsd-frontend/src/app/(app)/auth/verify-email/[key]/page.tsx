import type { Metadata } from 'next'

import VerifyEmail from '@/components/wsd/Auth/VerifyEmail'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default function VerifyEmailPage({ params }: { params: { key: string } }) {
  return <VerifyEmail verificationKey={params.key} />
}
