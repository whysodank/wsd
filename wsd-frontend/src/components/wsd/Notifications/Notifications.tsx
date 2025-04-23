'use client'

import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { ScrollArea } from '@radix-ui/react-scroll-area'

import { Button } from '@/components/shadcn/button'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import { Separator } from '@/components/shadcn/separator'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Notification } from '@/components/wsd/Notifications/Notification'

import { APIType } from '@/api'
import { useEffectAfterMount } from '@/lib/hooks'
import { useWSDAPI } from '@/lib/serverHooks'

import { useInView } from 'react-intersection-observer'

export function Notifications({ hasNew }: { hasNew?: boolean }) {
  const wsd = useWSDAPI()
  const searchParams = useSearchParams()

  const [notifications, setNotifications] = useState<APIType<'Notification'>[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const { ref: loaderRef, inView } = useInView()

  async function fetchNotifications(pageNum: number) {
    setLoading(true)
    const { data: notificationsData } = await wsd.notifications({
      page: pageNum,
      page_size: 10,
      ordering: '-created_at',
    })
    setNotifications((prev) => {
      const newNotifications = [...prev, ...(notificationsData?.results || [])]
      return _.uniqBy(newNotifications, 'id')
    })
    setHasMore(page !== notificationsData?.total_pages)
    setLoading(false)
  }

  // Reset and fetch first page
  function resetAndFetch() {
    setNotifications([])
    setPage(1)
    setHasMore(true)
    fetchNotifications(1)
  }

  const debouncedResetAndFetch = _.debounce(function () {
    resetAndFetch()
  }, 2000)

  useEffectAfterMount(() => {
    resetAndFetch()
  }, [searchParams])

  useEffect(() => {
    if (page > 1 && hasMore) {
      fetchNotifications(page)
    }
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1)
    }
  }, [inView, hasMore, loading])

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (!open) {
      debouncedResetAndFetch()
    }
  }

  return (
    <Overlay breakpoint="md" open={isOpen} onOpenChange={handleOpenChange}>
      <OverlayTrigger asChild>
        <Button variant="ghost" className="flex gap-2 h-10 w-10 rounded-full p-2">
          <div className="relative">
            <Icons.Bell size={20} />
            {hasNew && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-600 border" />}
          </div>
        </Button>
      </OverlayTrigger>
      <OverlayContent align="end" side="bottom">
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
