import * as Icons from 'lucide-react'

import { RawSVGIcon } from '@/components/shadcn/raw-svg-icon'
import { Separator } from '@/components/shadcn/separator'
import CategoryLink from '@/components/wsd/CategoryLink'
import MemesOption from '@/components/wsd/MemesOptions/client'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function LeftColumn() {
  const wsd = sUseWSDAPI()
  const { data: postCategoriesData } = await wsd.postCategories()

  function getQuickFilterHREF(params?: { [key: string]: string }) {
    return { pathname: '/', query: params }
  }

  const categories = postCategoriesData?.results || []
  return (
    <div className="w-full">
      <div className="pb-4 flex flex-col gap-1">
        <CategoryLink href={getQuickFilterHREF()} icon={<Icons.Clock size={20} />}>
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
        <Separator />
        <div className="ml-auto">
          <MemesOption />
        </div>
      </div>
    </div>
  )
}
