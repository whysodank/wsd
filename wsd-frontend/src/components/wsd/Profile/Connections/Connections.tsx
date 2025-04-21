'use server'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import * as Brands from '@/components/icons/brands'
import { Badge } from '@/components/shadcn/badge'
import { AutoFormButton } from '@/components/wsd/AutoFormButton/AutoFormButton'
import { DisconnectButton } from '@/components/wsd/Profile/Connections/client'

import config from '@/config'
import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function Connections() {
  const wsd = sUseWSDAPI()
  const { data } = await wsd.auth.connections()
  const connections = data?.data as { uid: string; display: string; provider: { id: string; name: string } }[]
  const connectedAccounts: string[] = connections ? _.map(connections, 'provider.id') : []
  const providerToUidMap = connections ? _.fromPairs(_.map(connections, (a) => [a.provider.id, a.uid])) : {}

  const providers = [
    { name: 'Google', icon: Brands.Google, id: 'google' },
    { name: 'Microsoft', icon: Brands.Microsoft, id: 'microsoft' },
    { name: 'GitHub', icon: Brands.GitHub, id: 'github' },
    { name: 'Discord', icon: Brands.Discord, id: 'discord' },
    { name: 'Reddit', icon: Brands.Reddit, id: 'reddit' },
  ]

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-bold">Connected Accounts</h2>
      <ul className="flex flex-col gap-2">
        {providers.map((provider) => (
          <li key={provider.id} className="flex items-center justify-between py-2 px-3 border rounded">
            <div className="flex items-center gap-2">
              <provider.icon />
              <span className="font-medium">{provider.name}</span>
              {connectedAccounts.includes(provider.id) ? (
                <Badge variant="default" className="bg-green-500">
                  <Icons.Check className="w-4 h-4" />
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Icons.X className="w-4 h-4" />
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {connectedAccounts.includes(provider.id) ? (
                <DisconnectButton provider={provider.id} account={providerToUidMap[provider.id]}>
                  Disconnect
                </DisconnectButton>
              ) : (
                <AutoFormButton
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                  type="submit"
                  method="POST"
                  action={wsd.auth.socialAuthFormAction}
                  payload={{
                    callback_url: `${config.url}/profile/connections`,
                    process: 'connect',
                    provider: provider.id,
                  }}
                >
                  Connect
                </AutoFormButton>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
