import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export default async function Home() {
  const wsd = sUseWSDAPI()
  const data = await (await wsd.auth.fetch('/auth/session')).json()

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
