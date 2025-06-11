type MimeType = 'image/png' | 'image/jpeg' | 'image/webp'

export function guessImageMimeType(filename: string): MimeType {
  const extension = filename.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'png':
      return 'image/png'
    case 'jfif': // JPEG File Interchange Format - It's "currently" interchangeable with jpeg https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'webp':
      return 'image/webp'
    default:
      return 'image/png' // Default to PNG if unknown
  }
}

export function isImageMimeType(mimeType: string): mimeType is MimeType {
  return mimeType === 'image/png' || mimeType === 'image/jpeg' || mimeType === 'image/webp'
}

export function escapeName(name: string): string {
  // Remove invalid characters for file names
  return name.replace(/[^a-zA-Z0-9-_.]/g, '_')
}

function safeFileName(filename: string, maxLength: number = 255) {
  const extension = filename.slice(filename.lastIndexOf('.'))
  const name = escapeName(filename.slice(0, filename.lastIndexOf('.')))
  if (filename.length <= maxLength) return filename
  return name.slice(0, maxLength - extension.length) + extension
}

/***
 * Downloads an image from a given URL and formats it to a specified MIME type.
 *
 * If the given mimeType is not supported by the browser, it defaults to PNG.
 * @param src - The source URL of the image to download.
 * @param name - The name to save the image as. Default is 'image.png'.
 * @param mimeType - The MIME type to format the image to. The default is 'image/png'. See https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#browser_compatibility for compatibility with browsers.
 * @param quality - The quality of the image (0-1) for JPEG and WEBP formats. Ignored for PNG.
 */
export async function downloadAndFormatImage(
  src: string,
  name: string = 'image.png',
  mimeType: MimeType = guessImageMimeType(src),
  quality: number = 1
) {
  name = safeFileName(name)
  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = src
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    ctx.drawImage(img, 0, 0)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Could not generate blob')
        }
        const link = document.createElement('a')
        const downloadUrl = URL.createObjectURL(blob)
        try {
          link.href = downloadUrl
          link.download = name
          document.body.appendChild(link)
          link.click()
        } finally {
          // Revoke the object URL to free up memory
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
        }
      },
      mimeType,
      quality
    )
  } catch (error) {
    console.error('Failed to download image:', error)
  }
}

/***
 * Converts a File object to a Base64 string using FileReader.
 * This function does not remove metadata from images.
 * @param file - The File object to convert.
 */
export async function fileToBase64Native(file: File): Promise<string> {
  const result = await new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

  if (typeof result === 'string') {
    return result
  } else {
    throw new Error('Failed to read file as Data URL')
  }
}

/***
 * Converts a File object to a Base64 string, removing metadata if it's an image.
 * If the image is not supported or the conversion fails, it falls back to fileToBase64Native.
 * @param file - The File object to convert.
 * @param quality - The quality of the image (0-1) for JPEG and WEBP formats. Ignored for PNG.
 */
export async function fileToBase64(file: File, quality: number = 1): Promise<string> {
  if (file.type.startsWith('image/')) {
    const img = new Image()
    const url = URL.createObjectURL(file)
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image for metadata removal'))
        img.src = url
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }
      ctx.drawImage(img, 0, 0)

      const cleanDataUrl = canvas.toDataURL(file.type, quality)
      if (cleanDataUrl === 'data:,') {
        // If the canvas.toDataURL returns an empty data URL, fallback to native file reading
        // Commonly happens with unsupported image types, canvas blocked / max size exceeded
        return await fileToBase64Native(file)
      }

      return cleanDataUrl
    } finally {
      URL.revokeObjectURL(url)
    }
  } else {
    return await fileToBase64Native(file)
  }
}
