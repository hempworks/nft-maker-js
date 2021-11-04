import { generateManifest } from '../actions'

export const command: string = 'manifest'
export const desc: string = 'Generate an NFT configuration manifest'

export const handler = (): void => {
  generateManifest(null)
  process.exit(0)
}
