import type { Metadata } from 'next'

import Signup from '@/components/wsd/Auth/Signup'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function SignupPage() {
  return <Signup />
}
