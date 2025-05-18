'use server'

import { ChangePasswordForm, SetPasswordForm } from '@/components/wsd/Profile/Password/client'

import { getWSDAPI } from '@/lib/serverHooks'

export async function Password() {
  const wsd = getWSDAPI()
  const { data } = await wsd.auth.session()
  const hasPassword = (data?.data as Record<'user', Record<'has_usable_password', boolean>>).user?.has_usable_password
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Password</h2>
      {hasPassword ? (
        <ChangePasswordForm />
      ) : (
        <>
          <div>You don't have a password yet, you can set one here.</div>
          <SetPasswordForm />
        </>
      )}
    </div>
  )
}
