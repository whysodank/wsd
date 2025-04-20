import * as Icons from 'lucide-react'

import { Card, CardContent } from '@/components/shadcn/card'
import UserAvatar from '@/components/wsd/UserAvatar'

import { APIType } from '@/api'
import { shortFormattedDate } from '@/lib/utils'

export function UserProfile({ user }: { user: APIType<'User'> | APIType<'PublicUser'> }) {
  return (
    <Card className="max-w-3xl w-5/6">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <UserAvatar user={user} />
          <div className="flex-1">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <div className="flex flex-col gap-y-1 text-sm text-muted-foreground mt-1">
                {user.last_login && (
                  <div className="flex items-center gap-1">
                    <Icons.Clock className="h-4 w-4" />
                    <span>Last login: {shortFormattedDate(new Date(user.last_login))}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Icons.Calendar className="h-4 w-4" />
                  <span>Member since: {shortFormattedDate(new Date(user.date_joined))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
