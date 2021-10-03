import type { Arguments } from 'yargs'
import { generateMetadata } from '../actions'

export const command: string = 'images'
export const desc: string = 'Generate the image files for the NFTs'

export const handler = (argv: Arguments): void => {
  generateMetadata()
  process.exit(0)
}
