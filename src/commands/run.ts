import type { Arguments } from 'yargs'
import {
  generateManifest,
  generateStats,
  generateMetadata,
  generateImages,
} from '../actions'

export const command: string = 'run'
export const desc: string = 'Run the generator'

export const handler = (argv: Arguments): void => {
  generateManifest()
  generateStats()
  generateMetadata()
  generateImages()

  process.exit(0)
}
