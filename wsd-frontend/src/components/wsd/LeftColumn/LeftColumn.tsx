import * as Icons from 'lucide-react'

import { Separator } from '@/components/shadcn/separator'
import CategoryLink from '@/components/wsd/CategoryLink'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function LeftColumn() {
  const wsd = sUseWSDAPI()
  const { data: postCategoriesData } = await wsd.postCategories()
  const categories = postCategoriesData?.results || []
  return (
    <div className="w-full">
      <div className="pb-4 flex flex-col gap-1">
        <CategoryLink href={{ pathname: 'categories/home' }} icon={<Icons.Home size={16} />}>
          Home
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/hot' }} icon={<Icons.Flame size={16} />}>
          Hot
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/trending' }} icon={<Icons.TrendingUp size={16} />}>
          Trending
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/conversational' }} icon={<Icons.MessagesSquare size={16} />}>
          Conversational
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/recent ' }} icon={<Icons.Clock size={16} />}>
          Recent
        </CategoryLink>
        <Separator />
        {categories.map((category) => (
          <CategoryLink
            href={{ pathname: `categories/${category.handle}` }}
            key={category.handle}
            // TODO: we probably should use an html parser here so that we don't kill the front-end
            // in case we mess up some icon svg in the admin panel
            // html-react-parser && dompurify
            icon={<div className="w-4 h-4" dangerouslySetInnerHTML={{ __html: category.icon }} />}
          >
            {category.name}
          </CategoryLink>
        ))}
      </div>
    </div>
  )
}
