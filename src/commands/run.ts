import type { Arguments } from 'yargs'
import generateManifest from '../actions/generateManifest'
import generateStats from '../actions/generateStats'
import generateMetadata from '../actions/generateMetadata'

export const command: string = 'run'
export const desc: string = 'Run the generator'

export const handler = (argv: Arguments): void => {
  generateManifest()
  generateStats()
  generateMetadata()

  process.exit(0)
}
