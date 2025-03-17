import * as Icons from 'lucide-react'

import { RawSVGIcon } from '@/components/shadcn/raw-svg-icon'
import { Separator } from '@/components/shadcn/separator'
import CategoryLink from '@/components/wsd/CategoryLink'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function LeftColumn() {
  const wsd = sUseWSDAPI()
  const { data: postCategoriesData } = await wsd.postCategories()

  function getQuickFilterHREF(params: { [key: string]: string }) {
    return { pathname: '/', query: params }
  }

  const categories = postCategoriesData?.results || []
  return (
    <div className="w-full">
      <div className="pb-4 flex flex-col gap-1">
        <CategoryLink href={getQuickFilterHREF({ feed: 'home' })} icon={<Icons.Home size={20} />}>
          Home
        </CategoryLink>
        <CategoryLink href={getQuickFilterHREF({ feed: 'hot' })} icon={<Icons.Flame size={20} />}>
          Hot
        </CategoryLink>
        <CategoryLink href={getQuickFilterHREF({ feed: 'trending' })} icon={<Icons.TrendingUp size={20} />}>
          Trending
        </CategoryLink>
        <CategoryLink href={getQuickFilterHREF({ feed: 'conversational' })} icon={<Icons.MessagesSquare size={24} />}>
          Conversational
        </CategoryLink>
        <CategoryLink href={getQuickFilterHREF({ feed: 'recent' })} icon={<Icons.Clock size={20} />}>
          Recent
        </CategoryLink>
        <Separator />
        {categories.map((category) => (
          <CategoryLink
            href={getQuickFilterHREF({ category__handle: category.handle })}
            key={category.handle}
            icon={<RawSVGIcon svg={category.icon} />}
          >
            {category.name}
          </CategoryLink>
        ))}
      </div>
    </div>
  )
}
