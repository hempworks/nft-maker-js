import type { Arguments } from 'yargs'
import generateManifest from '../actions/generateManifest'

export const command: string = 'manifest'
export const desc: string = 'Generate an NFT configuration manifest'

export const handler = (argv: Arguments): void => {
  generateManifest()
  process.exit(0)
}
