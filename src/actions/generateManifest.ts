import fs from 'fs'
import { dd, fail, resolveConfiguration } from '../util'
import { find, shuffle, sumBy, times } from 'lodash'
import { Incompatible, Image, Trait, TraitCategory } from '../defs'

let imageData: any = []
let attempts = 0
let maxNumberOfAttempts = 0

export default function () {
  const { maxAttempts, uniques, editionSize } = resolveConfiguration()
  maxNumberOfAttempts = maxAttempts

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
  proposedTrait: Trait,
  existing: Image
): boolean {
  if (Object.keys(existing).length > 0) {
    // Pull the incompatibilities for the proposedTrait and
    // go through every existing proposedTrait, to see
    // if the proposed proposedTrait is compatible
    // return Object.keys(existing).reduce(
    //   (isCompatible: boolean, existingKey: string) => {
    //     console.log(existingKey, proposedTrait.name)
    //     return true
    //   },
    //   true // We assume compatibility by default
    // )

    const { traits } = resolveConfiguration()

    // Check if the proposed trait is incompatible
    // with any of the existing image values.
    if (proposedTrait.hasOwnProperty('incompatible')) {
      return Object.keys(proposedTrait.incompatible as Incompatible).reduce(
        (isCompatible: boolean, incompatKey: string) => {
          // console.log(proposedTrait.incompatible?.[incompatKey])
          // let { incompatibles } = proposedTrait.incompatible

          let incompatible: Incompatible[] = []
          if (proposedTrait.incompatible) {
            incompatible = proposedTrait.incompatible[incompatKey]
          }

          // if (incompatible) {
          //   //
          //   return true
          // }

          // console.log(incompatibles)

          // Get the trait category we're checking...
          // let existingTrait = traits.filter(
          //   (category: TraitCategory) => category.name == incompatKey
          // )[0]

          // Get the trait item and see if the key exists
          // let existingTraitItem = existingTrait.items.filter((t: Trait) => {
          // fail([trait.name, proposedTrait.name])
          // trait.name == proposedTrait.name
          // return t.name == trait.name
          // console.log(trait.name, proposedTrait.name)
          // })

          // console.log(existingTraitItem)

          return isCompatible
        },
        true // We assume compatibility by default
      )
    }

    return true
  }

  return true
}
