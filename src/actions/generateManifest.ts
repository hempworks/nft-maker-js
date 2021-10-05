import fs from 'fs'
import { resolveConfiguration } from '../util'
import { reduce, shuffle, times } from 'lodash'
import { getRandomWeightedTrait } from '../lib'
import { TraitCategory } from '../defs'

let imageData: any = []

export default function () {
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
}

function createNewUniqueImage(traits: Array<TraitCategory>): object {
  let attempts = 0
  let newImage = createNewImage(traits)

  if (imageData.includes(newImage)) {
    attempts++
    return createNewUniqueImage(traits)
  }

  attempts = 0

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