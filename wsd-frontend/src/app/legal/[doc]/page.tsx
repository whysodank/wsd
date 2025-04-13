import { notFound } from 'next/navigation'

import _ from 'lodash'

import Markdown from '@/components/wsd/Markdown'

import { getFileAsString } from '@/lib/serverOnlyUtils'

export default async function LegalDocument(props: { params: Promise<{ doc: string }> }) {
  const params = await props.params

  const { doc } = params

  const legalDocs = {
    'privacy-policy': '/src/legal/privacy-policy.md',
    'terms-of-service': '/src/legal/terms-of-service.md',
  }

  const document = _.get(legalDocs, doc)

  if (_.isNil(document)) {
    return notFound()
  }

  return <Markdown content={await getFileAsString(document)} />
}
