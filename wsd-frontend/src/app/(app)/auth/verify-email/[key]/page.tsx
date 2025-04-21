import type { Metadata } from 'next'

import VerifyEmail from '@/components/wsd/Auth/VerifyEmail'

import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({ noIndex: true })
}

export default async function VerifyEmailPage(props: { params: Promise<{ key: string }> }) {
  const params = await props.params
  return <VerifyEmail verificationKey={params.key} />
}
