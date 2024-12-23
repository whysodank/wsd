import type { Metadata } from 'next'

import Login from '@/components/wsd/Auth/Login'

import config from '@/config'
import { getWSDMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getWSDMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function LoginPage() {
  return <Login />
}
