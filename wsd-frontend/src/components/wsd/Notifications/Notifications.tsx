'use client'

import { useEffect, useState } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { ScrollArea } from '@radix-ui/react-scroll-area'

import { Button } from '@/components/shadcn/button'
import { Overlay, OverlayContent, OverlayDescription, OverlayTitle, OverlayTrigger } from '@/components/shadcn/overlay'
import { Separator } from '@/components/shadcn/separator'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Notification } from '@/components/wsd/Notifications/Notification'

import { APIType } from '@/api'
import { useWSDAPI } from '@/lib/serverHooks'

import { useInView } from 'react-intersection-observer'

export function Notifications({ hasNew }: { hasNew?: boolean }) {
  const wsd = useWSDAPI()

  const [notifications, setNotifications] = useState<APIType<'Notification'>[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { ref: loaderRef, inView } = useInView()

  async function fetchNotifications(pageNum: number) {
    setLoading(true)
    const { data: notificationsData } = await wsd.notifications({
      page: pageNum,
      page_size: 10,
      ordering: '-created_at',
      include: 'post',
    })
    setNotifications((prev) => {
      const newNotifications = [...prev, ...(notificationsData?.results || [])]
      return _.uniqBy(newNotifications, 'id')
    })
    setHasMore(page !== notificationsData?.total_pages)
    setLoading(false)
  }

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1)
      fetchNotifications(page)
    }
  }, [inView, hasMore, loading])

  function onOverlayOpenChange(open: boolean) {
    if (!open) {
      setNotifications([])
      setPage(1)
      setHasMore(true)
    }
  }

  return (
    <Overlay breakpoint="md" onOpenChange={onOverlayOpenChange}>
      <OverlayTrigger asChild>
        <Button variant="ghost" className="flex gap-2 h-10 w-10 rounded-full p-2">
          <div className="relative">
            <Icons.Bell size={20} />
            {hasNew && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-600 border" />}
          </div>
        </Button>
      </OverlayTrigger>
      <OverlayContent align="end" side="bottom">
        <OverlayTitle className="hidden">Notifications</OverlayTitle>
        <OverlayDescription className="hidden">Notifications</OverlayDescription>
        <ScrollArea className="max-h-[50vh] overflow-auto">
          {notifications.map((notification) => (
            <div className="contents" key={notification.id}>
              <Notification notification={notification} />
              <div className="px-4">
                <Separator />
              </div>
            </div>
          ))}
          {loading && <Skeleton className="w-full h-1 rounded-md" />}
          {!hasMore && notifications.length === 0 && (
            <div className="w-full flex items-center justify-center">No notifications yet!</div>
          )}
          <div ref={loaderRef} className="h-1 w-full" />
        </ScrollArea>
      </OverlayContent>
    </Overlay>
  )
}
