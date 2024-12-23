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

export default function PasswordResetPage({ params }: { params: { key: string } }) {
  return <PasswordRest passwordResetKey={params.key} />
}
