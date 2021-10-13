import fs from 'fs'
import { dd, fail, resolveConfiguration } from '../util'
import { find, shuffle, sumBy, times } from 'lodash'
import { Image, Trait, TraitCategory } from '../defs'

let imageData: any = []
let attempts = 0
let { maxAttempts: maxNumberOfAttempts } = resolveConfiguration()

export default function () {
  const { uniques, editionSize } = resolveConfiguration()

  prepareOutputFolder()

  uniques.forEach((u: Image) => {
    if (validUnique(u)) {
      imageData.push(u)
    }
  })

  times(editionSize - uniques.length, () =>
    imageData.push(createNewUniqueImage())
  )

  imageData = shuffle(imageData)

  // Assign token IDs...
  imageData = imageData.map((item: any, key: number) => {
    item['tokenId'] = key + 1
    return item
  })

  fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
    flag: 'w',
  })
}

function prepareOutputFolder() {
  let assetsDir = './assets'

  if (fs.existsSync(assetsDir)) {
    fs.rmdirSync(assetsDir, { recursive: true })
  }
}

export function createNewUniqueImage(): object {
  attempts++

  if (attempts >= maxNumberOfAttempts) {
    fail(`Could not generate unique image after ${attempts} attempts.`)
  }

  let newImage = createNewImage()

  if (!imageData.includes(newImage)) {
    return newImage
  }

  return createNewUniqueImage()
}

export function createNewImage() {
  const { order } = resolveConfiguration()

  return order.reduce((existing: Image, trait: string) => {
    return {
      ...existing,
      [trait]: getRandomWeightedTrait(trait, existing),
    }
  }, {})
}

export function getRandomWeightedTrait(trait: string, existing: Image): string {
  const { traits } = resolveConfiguration()

  const category: TraitCategory = find(
    traits,
    (t: TraitCategory) => t.name == trait
  )

  // Find compatible category trait items for the existing object
  // If it's the first time to find a trait we'll just grab
  // whichever one we want, since there's nothing to check.
  let items: Trait[] = category.items

  items = items.filter((trait: Trait) => {
    return traitIsCompatibleWithCurrentImage(trait, existing)
  })

  let sum = sumBy(category.items, (i: Trait) => i.weight)
  const threshold = Math.random() * sum

  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i].weight

    if (total >= threshold) {
      return items[i].name
    }
  }

  return items[items.length - 1].name
}

export function validUnique(unique: Image) {
  const { traits } = resolveConfiguration()
  const traitKeys = traits.map((t: TraitCategory) => t.name)

  Object.keys(unique).forEach(trait => {
    if (!traitKeys.includes(trait)) {
      fail(`Invalid unique: ${trait}`)
    }
  })

  return true
}

export function traitIsCompatibleWithCurrentImage(
  trait: Trait,
  existing: Image
): boolean {
  if (Object.keys(existing).length > 0) {
    dd(trait, existing)
    return true
  }

  return true
}
