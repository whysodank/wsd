import { Metadata } from 'next'

import _ from 'lodash'

import config from '@/config'

export type WSDMetaData = {
  title: string
  description: string
  noIndex?: boolean
  image?: string
}

export async function getWSDMetadata(metadata: WSDMetaData): Promise<Metadata> {
  // Base metadata + og metadata for wsd
  const index = metadata.noIndex ? noIndex : {}

  const metaData = {
    title: metadata.title,
    description: metadata.description,
    publisher: config.name,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      url: config.url,
      siteName: config.name,
      ...(metadata.image
        ? {
            images: [
              {
                url: metadata.image,
                alt: metadata.title,
              },
            ],
          }
        : {}),
    },
  }

  return _.merge(metaData, index)
}

export const noIndex: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}
