import { NewPostForm } from '@/components/wsd/NewPost/client'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function NewPost() {
  const wsd = sUseWSDAPI()
  const { data: postCategoriesData } = await wsd.postCategories()

  return <NewPostForm categories={postCategoriesData?.results || []} />
}
