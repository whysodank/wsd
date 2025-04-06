import { notFound } from 'next/navigation'

import _ from 'lodash'

import Markdown from '@/components/wsd/Markdown'

import { getFileAsString } from '@/lib/serverOnlyUtils'

export default async function LegalDocument({ params: { doc } }: { params: { doc: string } }) {
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
