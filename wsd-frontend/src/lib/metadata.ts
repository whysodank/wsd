import { Metadata } from 'next'

import _ from 'lodash'

import config from '@/config'

export type WSDMetaData = {
  title: string
  description: string
  noIndex?: boolean
}

export async function getWSDMetadata(metadata: WSDMetaData): Promise<Metadata> {
  // Base metadata + og metadata for wsd
  const index = metadata.noIndex ? noIndex : {}
  const medaData = {
    title: metadata.title,
    description: metadata.description,
    publisher: config.name,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      url: config.url,
      siteName: config.name,
    },
  }
  return _.merge(medaData, index)
}

export const noIndex: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}
