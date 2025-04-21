'use server'

import * as Icons from 'lucide-react'

import LogoutButton from '@/components/wsd/LogoutButton'
import { InfoItem } from '@/components/wsd/Profile/Details/InfoItem'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

import { format } from 'date-fns'

export async function Details() {
  const wsd = sUseWSDAPI()
  const { data: userData } = await wsd.me()
  return (
    userData && (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Account Details</h2>
        <InfoItem label="Username" value={userData.username} />
        <InfoItem label="Primary Email" value={userData.email} />
        <InfoItem label="Member Since" value={format(new Date(userData.created_at), 'MMMM d, yyyy')} />
        <LogoutButton className="w-full gap-2">
          Logout
          <Icons.LogOut className="h-4 w-4" />
        </LogoutButton>
      </div>
    )
  )
}
