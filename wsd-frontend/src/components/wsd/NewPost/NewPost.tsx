import { NewPostForm } from '@/components/wsd/NewPost/client'

import { useWSDAPI as sUseWSDAPI } from '@/lib/serverHooks'

export async function NewPost() {
  const wsd = sUseWSDAPI()
  const { data: postCategoriesData } = await wsd.postCategories()
  const categories = postCategoriesData?.results?.map((category) => ({ name: category.name, value: category.id })) || []

  return <NewPostForm categories={categories} />
}
