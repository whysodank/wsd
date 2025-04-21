import { Metadata } from 'next'

import _ from 'lodash'

import config from '@/config'

export type WSDMetaData = {
  title?: string
  description?: string
  noIndex?: boolean
  image?: string
}

const DEFAULT_WSD_METADATA: WSDMetaData = {
  title: `${config.name} - ${config.motto}`,
  description:
    'Dank memes. Viral chaos. Strange news. Regular people. ' +
    'WSD keeps your humor feed unreasonably funny. No filter, ne censorship, just fire.',
  noIndex: false,
  image: config.image,
}

export async function getWSDMetadata(metadata: WSDMetaData = DEFAULT_WSD_METADATA): Promise<Metadata> {
  // Base metadata + og metadata for wsd
  const index = metadata.noIndex ? noIndex : {}
  const wsdMetadata = {
    ...DEFAULT_WSD_METADATA,
    ...metadata,
  }

  const metaData = {
    title: wsdMetadata.title,
    description: wsdMetadata.description,
    publisher: config.name,
    openGraph: {
      title: wsdMetadata.title,
      description: wsdMetadata.description,
      type: 'website',
      url: config.url,
      siteName: config.name,
      ...(wsdMetadata.image
        ? {
            images: [
              {
                url: wsdMetadata.image,
                alt: wsdMetadata.title,
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
