import fs from 'fs'
import { info, resolveConfiguration, success } from '../util'
import { reduce, shuffle, times } from 'lodash'
import { getRandomWeightedTrait } from '../lib'
import { TraitCategory } from '../defs'

let imageData: any = []

export default function handle() {
  info('Generating NFT manifest...')

  let assetsDir = './assets'

  if (fs.existsSync(assetsDir)) {
    fs.rmdirSync(assetsDir, { recursive: true })
  }

  const { traits, uniques, editionSize } = resolveConfiguration()

  uniques.forEach((u: object) => imageData.push(u))

  times(editionSize - uniques.length, () =>
    imageData.push(createNewUniqueImage(traits))
  )

  imageData = shuffle(imageData)

  // Check compatibility

  // Assign token IDs...
  imageData = imageData.map((item: any, key: number) => {
    item['tokenId'] = key + 1
    return item
  })

  fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
    flag: 'w',
  })

  success('Finished generating NFT manifest!')
}

function createNewUniqueImage(traits: Array<TraitCategory>): object {
  let newImage = createNewImage(traits)

  if (imageData.includes(newImage)) {
    return createNewUniqueImage(traits)
  }

  return newImage
}

function createNewImage(traits: Array<TraitCategory>) {
  return reduce(
    traits,
    (carry, { name }) => {
      return {
        ...carry,
        ...{ [name]: getRandomWeightedTrait(traits, name) },
      }
    },
    {}
  )
}
