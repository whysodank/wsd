import { NewPostForm } from '@/components/wsd/NewPost/client'

import { getWSDAPI } from '@/lib/serverHooks'

export async function NewPost() {
  const wsd = getWSDAPI()
  const { data: postCategoriesData } = await wsd.postCategories()

  return <NewPostForm categories={postCategoriesData?.results || []} />
}
