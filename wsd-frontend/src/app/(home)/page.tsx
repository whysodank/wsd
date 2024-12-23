import Link from 'next/link'

import { Button } from '@/components/shadcn/button'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default async function Home() {
  const wsd = sUseWSDAPI()
  const { data } = await wsd.auth.session()

  let link
  if (data) {
    link = <Link href={{ pathname: '/profile/details' }}>Profile</Link>
  } else {
    link = <Link href={{ pathname: '/auth/login' }}>Login</Link>
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button>{link}</Button>
    </div>
  )
}
