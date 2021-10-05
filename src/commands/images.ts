import { generateImages } from '../actions'

export const command: string = 'images'
export const desc: string = 'Generate the image files for the NFTs'

export const handler = (): void => {
  generateImages(null).then(r => process.exit(0))
}
