import type { Arguments } from 'yargs'
import { generateImages } from '../actions'

export const command: string = 'images'
export const desc: string = 'Generate the image files for the NFTs'

export const handler = (argv: Arguments): void => {
  generateImages()
  process.exit(0)
}
