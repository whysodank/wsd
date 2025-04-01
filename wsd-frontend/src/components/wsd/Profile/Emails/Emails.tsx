import * as Icons from 'lucide-react'

import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Overlay, OverlayClose, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import {
  AddEmailForm,
  DeleteEmailButton,
  MarkEmailPrimaryButton,
  ResendVerificationEmailButton,
} from '@/components/wsd/Profile/Emails/client'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function Emails() {
  const wsd = sUseWSDAPI()
  const { data } = await wsd.auth.emails()
  const emails = data?.data as { email: string; primary: boolean; verified: boolean }[] | undefined
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Emails</h2>
      {emails ? (
        <ul className="flex flex-col gap-2">
          {emails.map((email) => (
            <li key={email.email} className="flex items-center justify-between py-2 px-3 border rounded">
              <div className="flex items-center gap-2">
                <span className="max-xs:text-sm">{email.email}</span>
                {email.verified ? (
                  <Badge variant="secondary" className="p-0.5">
                    <Icons.Check className="w-3 h-3" />
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="p-0.5">
                    <Icons.X className="w-3 h-3" />
                  </Badge>
                )}
                {email.primary && (
                  <Badge variant="secondary" className="p-0.5">
                    <Icons.Star className="w-3 h-3 fill-current" />
                  </Badge>
                )}
              </div>
              <Overlay breakpoint="md">
                <OverlayTrigger>
                  <Button variant="ghost" size="icon" disabled={email.primary}>
                    <Icons.MoreHorizontal className="h-4 w-4" />
                  </Button>
                </OverlayTrigger>
                <OverlayContent side="bottom" align="end">
                  <OverlayClose className="w-full">
                    {!email.primary && email.verified && (
                      <MarkEmailPrimaryButton variant="ghost" className="w-full justify-start" email={email.email}>
                        Make Primary
                      </MarkEmailPrimaryButton>
                    )}
                    {!email.verified && (
                      <>
                        <ResendVerificationEmailButton
                          variant="ghost"
                          className="w-full justify-start"
                          email={email.email}
                        >
                          Resend Verification Email
                        </ResendVerificationEmailButton>
                        <DeleteEmailButton variant="ghost" className="w-full justify-start" email={email.email}>
                          Delete Email
                        </DeleteEmailButton>
                      </>
                    )}
                  </OverlayClose>
                </OverlayContent>
              </Overlay>
            </li>
          ))}
        </ul>
      ) : (
        <span>You don't have any email addresses.</span>
      )}
      <AddEmailForm />
    </div>
  )
}
