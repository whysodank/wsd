import type { Metadata } from 'next'

import PasswordRest from '@/components/wsd/Auth/PasswordReset'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default async function PasswordResetPage(props: { params: Promise<{ key: string }> }) {
  const params = await props.params
  return <PasswordRest passwordResetKey={params.key} />
}
