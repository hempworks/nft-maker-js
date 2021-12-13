import fs from 'fs'
import { fail, getTraitItemConfiguration, resolveConfiguration } from '../util'
import { find, shuffle, times, isEqual, uniq } from 'lodash'
import { ManifestItem, UniqueDefinition, TraitItem, TraitCategoryConfiguration, Unique } from '../defs'

export default function (): boolean {
  const { uniques, editionSize } = resolveConfiguration()
  let imageData: ManifestItem[] = []

  let uniqueImages = uniques as unknown as Map<string, Unique>

  prepareOutputFolder()

  uniqueImages.forEach((unique: Unique) => {
    if (validUnique(unique)) {
      imageData.push(createManifestItemFromUnique(unique))
    } else {
      throw Error(`Invalid unique found: ${JSON.stringify(unique)}`)
    }
  })

  times(editionSize - uniques.length, () => imageData.push(createNewUniqueImage(imageData)))

  imageData = shuffle(imageData)
  imageData = assignTokenIds(imageData)

  writeManifest(imageData)

  return true
}

function createManifestItemFromUnique(unique: Unique): ManifestItem {
  return Object.keys(unique).reduce((carry: any, uniqueKey: string) => {
    let uniqueDefinition: UniqueDefinition = unique[uniqueKey]

    return {
      ...carry,
      [uniqueKey]: {
        name: uniqueDefinition.name,
        image: uniqueDefinition.image || uniqueDefinition.name,
      },
    }
  }, {})
}

function validUnique(unique: Unique): boolean {
  const { order } = resolveConfiguration()

  return Object.keys(unique).some((traitCategoryKey: string) => {
    return order.includes(traitCategoryKey)
  })
}

function createNewUniqueImage(imageData: ManifestItem[]): ManifestItem {
  let newImage = createNewImage()
  const { allowDuplicates } = resolveConfiguration()

  if (duplicateFound(imageData, newImage) && !allowDuplicates) {
    throw Error(`Duplicate image found: ${JSON.stringify(newImage)}`)
  }

  return newImage
}

function createNewImage(): ManifestItem {
  const { order } = resolveConfiguration()

  return order.reduce((existing: ManifestItem, trait: string) => {
    return {
      ...existing,
      ...getRandomWeightedTrait(trait, existing),
    }
  }, {})
}

function getRandomWeightedTrait(trait: string, existing: ManifestItem): ManifestItem {
  const { traits } = resolveConfiguration()

  const category: TraitCategoryConfiguration | undefined = find(
    traits,
    (t: TraitCategoryConfiguration) => t.name == trait
  )

  if (category !== undefined) {
    // Find compatible category trait items for the existing object
    // If it's the first time to find a trait we'll just grab
    // whichever one we want since there's nothing to check.
    let items: TraitItem[] = category.items

    items = items.filter((trait: TraitItem) => {
      return traitIsCompatibleWithCurrentImage(category, trait, existing)
    })

    if (items.length == 0) {
      fail(`Could not generate unique image because there are no compatible traits for ${trait}`)
    }

    shuffle(items)

    let choices = items.reduce((carry: any, item, key: number) => {
      return carry.concat(new Array(item.weight).fill(key))
    }, [])

    // Shuffle the choices
    shuffle(choices)

    // Pull a random
    let choice = Math.floor(Math.random() * (choices.length - 1))
    let index = choices[choice]

    return {
      [trait]: {
        name: items[index].name,
        image: items[index].image || items[index].name,
      },
    }
  }

  throw Error('Could not complete')
}

export function traitIsCompatibleWithCurrentImage(
  category: TraitCategoryConfiguration,
  maybeTrait: TraitItem,
  existing: ManifestItem
): boolean {
  // This is the first trait for the image, so we can pick literally anything.
  // if (Object.keys(existing).length === 0) {
  //   return true
  // }

  // Backwards Check
  const closure = maybeTrait.conflicts
  let backwards = true

  if (closure) {
    backwards = Object.keys(existing).reduce((carry: boolean, val: string): boolean => {
      // @ts-ignore
      let result = !closure(val, existing[val].name as string)

      if (!carry) {
        return false
      }

      return result
    }, true)
  }

  // Forwards Check
  const forwards = Object.keys(existing).reduce((carry: boolean, existingVal: string): boolean => {
    let singleItem = getTraitItemConfiguration(
      existingVal,
      // @ts-ignore
      existing[existingVal].name
    )

    if (!singleItem) throw Error(`Could not find single trait item configuration for: ${existingVal}`)

    if (singleItem.conflicts !== undefined) {
      let closure = singleItem.conflicts
      let result = !closure(category.name, maybeTrait.name)

      if (!carry) {
        return false
      }

      return result
    }

    return true
  }, true)

  return backwards && forwards
}

function writeManifest(imageData: ManifestItem[]): void {
  fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
    flag: 'w',
  })
}

function assignTokenIds(imageData: ManifestItem[]): ManifestItem[] {
  return imageData.map((item: any, key: number) => {
    item['tokenId'] = key + 1
    return item
  })
}

function prepareOutputFolder(): void {
  const assetsPath = './assets'
  const manifestPath = 'manifest.json'
  const statsPath = 'stats.json'

  if (fs.existsSync(assetsPath)) fs.rmdirSync(assetsPath, { recursive: true })
  if (fs.existsSync(manifestPath)) fs.rmSync(manifestPath)
  if (fs.existsSync(statsPath)) fs.rmSync(statsPath)
}

function duplicateFound(imageData: ManifestItem[], newImage: ManifestItem): boolean {
  return imageData.some((image: ManifestItem) => isEqual(image, newImage))
}
