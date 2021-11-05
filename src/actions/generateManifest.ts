import fs from 'fs'
import {
  fail,
  getSingleTraitItemConfiguration,
  resolveConfiguration,
} from '../util'
import { find, shuffle, sumBy, times, isEqual } from 'lodash'
import { Image, ImageDefinition, Task, Trait, TraitCategory } from '../defs'

let imageData: any = []
let attempts = 0
let maxNumberOfAttempts = 0

export default async function (task: null | Task): Promise<void> {
  const { maxAttempts, uniques, editionSize } = resolveConfiguration()
  maxNumberOfAttempts = maxAttempts

  prepareOutputFolder()

  uniques.forEach((u: Image) => {
    if (validUnique(u)) {
      imageData.push(u)
    }
  })

  times(editionSize - uniques.length, () => {
    attempts++

    if (attempts == maxNumberOfAttempts) {
      fail(`Could not find a unique image after ${attempts} attempts.`)
    }

    imageData.push(createNewUniqueImage())
    attempts = 0
  })

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
  let newImage = createNewImage()

  if (duplicateFound(imageData, newImage)) {
    return createNewUniqueImage()
  }

  attempts = 0
  return newImage
}

function duplicateFound(imageData: Image[], newImage: Image): boolean {
  return imageData.reduce((foundDuplicate: boolean, image: Image) => {
    if (foundDuplicate) {
      return true
    }

    foundDuplicate = isEqual(image, newImage)

    return foundDuplicate
  }, false)
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

export function getRandomWeightedTrait(
  trait: string,
  existing: Image
): ImageDefinition {
  const { traits } = resolveConfiguration()

  const category: TraitCategory = find(
    traits,
    (t: TraitCategory) => t.name == trait
  )

  // Find compatible category trait items for the existing object
  // If it's the first time to find a trait we'll just grab
  // whichever one we want since there's nothing to check.
  let items: Trait[] = category.items

  items = items.filter((trait: Trait) => {
    return traitIsCompatibleWithCurrentImage(category, trait, existing)
  })

  if (items.length == 0) {
    fail(
      `Could not generate unique image because there are no compatible traits for ${trait}`
    )
  }

  let sum = sumBy(category.items, (i: Trait) => i.weight)
  const threshold = Math.random() * sum

  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i].weight

    if (total >= threshold) {
      return {
        name: items[i].name,
        image: items[i].image || items[i].name,
      }
    }
  }

  return {
    name: items[items.length - 1].name,
    image: items[items.length - 1].image || items[items.length - 1].name,
  }
}

export function traitIsCompatibleWithCurrentImage(
  category: TraitCategory,
  maybeTrait: Trait,
  existing: Image
): boolean {
  // This is the first trait for the image, so we can pick literally anything.
  if (Object.keys(existing).length === 0) {
    return true
  }

  // Check if this trait, which is one of the options we'll randomly select from,
  // is compatible with the existing trait values. We'll do this by running
  // this prospective trait item's conflict closure against the existing image's
  // trait key and value pairs

  // Backwards Check
  const closure = maybeTrait.conflicts
  let backwards = true

  if (closure) {
    backwards = Object.keys(existing).reduce(
      (carry: boolean, val: string): boolean => {
        // @ts-ignore
        let result = !closure(val, existing[val].name as string)

        if (!carry) {
          return false
        }

        return result
      },
      true
    )
  }

  // Forward Check
  // for every trait that already exists,
  // if it has a conflict definition,
  // pass this new trait/value into that and if it fails, return false
  // foreach trait
  // if has conflict definition
  // pass this new trait/value into conflict()
  // return false if fails
  const forwards = Object.keys(existing).reduce(
    (carry: boolean, existingVal: string): boolean => {
      let singleItem = getSingleTraitItemConfiguration(
        existingVal,
        // @ts-ignore
        existing[existingVal].name
      )

      let closure = singleItem.conflicts

      if (closure) {
        let result = !closure(category.name, maybeTrait.name)

        if (!carry) {
          return false
        }

        return result
      }

      return true
    },
    true
  )

  return backwards && forwards
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
