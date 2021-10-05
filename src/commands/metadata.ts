import { generateMetadata } from '../actions'

export const command: string = 'metadata'
export const desc: string =
  'Generate the required metadata for the individual NFTs'

export const handler = (): void => {
  generateMetadata(null).then(r => process.exit(0))
}
