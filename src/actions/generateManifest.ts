import fs from 'fs'
import { info, resolveConfiguration, success } from '../util'
import { Attribute } from '../defs'
import { times } from 'lodash'
import { createNewUniqueImage } from '../lib'

export default function handle() {
  info('Generating NFT manifest...')

  const { traits, editionSize } = resolveConfiguration()

  let imageData: Array<Attribute> = times(editionSize, () =>
    createNewUniqueImage(traits)
  )

  // Pull in the uniques...

  // Shuffle the deck a couple of times...

  // Check compatibility

  // Make sure it's unique

  // Assign token IDs...
  imageData = imageData.map((item, key) => {
    item['tokenId'] = key + 1
    return item
  })

  fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
    flag: 'w',
  })

  success('Finished generating NFT manifest!')
}
