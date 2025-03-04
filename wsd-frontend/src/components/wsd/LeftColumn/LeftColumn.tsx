import * as Icons from 'lucide-react'

import { Separator } from '@/components/shadcn/separator'
import CategoryLink from '@/components/wsd/CategoryLink'

export async function LeftColumn() {
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
        <CategoryLink href={{ pathname: 'categories/geek' }} icon={<Icons.Glasses size={16} />}>
          Geek
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/gaming' }} icon={<Icons.Gamepad2 size={16} />}>
          Gaming
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/pets' }} icon={<Icons.Dog size={16} />}>
          Pets
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/rage' }} icon={<Icons.Angry size={16} />}>
          Rage
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/dank' }} icon={<Icons.Clock9 size={16} />}>
          Dank
        </CategoryLink>
        <CategoryLink href={{ pathname: 'categories/wholesome' }} icon={<Icons.Cloud size={16} />}>
          Wholesome
        </CategoryLink>
      </div>
    </div>
  )
}
