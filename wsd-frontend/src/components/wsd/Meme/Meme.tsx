import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { FeedbackButtons } from '@/components/wsd/Meme/client'

import { APIType } from '@/api'
import { cn } from '@/lib/utils'

export async function Meme({ post }: { post: APIType<'Post'> }) {
  return (
    <article
      className={cn('shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md w-5/6', 'max-md:w-full')}
    >
      <div className="flex flex-col gap-2 p-4 max-md:p-2 max-md:py-0">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <div className="relative w-full flex justify-center items-center bg-black overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              // backgroundImage: `url(${post.image})`,
              backgroundColor: 'black',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px)',
            }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <img
            src={post.image}
            alt={post.title}
            className="relative z-10 w-auto max-w-[80%] h-auto max-h-[750px] max-md:max-w-full"
            loading="lazy"
          />
        </div>
        <div className="flex items-center gap-4">
          <FeedbackButtons post={post} />
          <Button
            className="flex items-center gap-1 p-2 rounded-md transition-colors text-gray-500 hover:bg-gray-900 bg-transparent"
            aria-label="Share"
          >
            <Icons.Share2 size={20} />
          </Button>
        </div>
      </div>
    </article>
  )
}
