import type { Metadata } from 'next'

import ForgotPassword from '@/components/wsd/Auth/ForgotPassword'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function ForgotPasswordPage() {
  return <ForgotPassword />
}
