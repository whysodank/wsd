import fs from 'fs/promises'
import path from 'path'

export async function getFileAsString(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), filename)
    return await fs.readFile(filePath, 'utf8')
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error)
    return `Error reading file: ${error instanceof Error ? error.message : String(error)}`
  }
}
