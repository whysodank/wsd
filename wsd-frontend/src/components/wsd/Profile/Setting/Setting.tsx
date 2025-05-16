'use server'

import { SettingForm } from '@/components/wsd/Profile/Setting/client'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function Setting() {
  const wsd = sUseWSDAPI()
  const currentUser = await wsd.getCurrentUser()
  return <SettingForm currentCardStyle={currentUser?.card_style || 'NORMAL'} />
}
