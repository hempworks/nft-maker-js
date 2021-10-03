import type { Arguments } from 'yargs'
import { generateMetadata } from '../actions'

export const command: string = 'metadata'
export const desc: string =
  'Generate the required metadata for the individual NFTs'

export const handler = (argv: Arguments): void => {
  generateMetadata()
  process.exit(0)
}
