import { times, map, transform, reduce, find, sumBy } from 'lodash'

interface TraitCategory {
  name: string
  items: Array<Trait>
}

interface Trait {
  name: string
  weight: number
}

interface Attribute {
  [name: string]: any
}

let { traits: t, uniques, editionSize } = require('../project.config.js')

const traits: Array<TraitCategory> = t

let imageData: Array<Attribute> = times(editionSize, () =>
  createNewUniqueImage()
)

console.log(imageData)

function createNewUniqueImage(): Attribute {
  return createNewImage()
}

function createNewImage(): Attribute {
  return map(traits, ({ name }) => {
    return { [name]: getRandomWeightedTrait(name) }
  })
}

function getRandomWeightedTrait(traitName: string): string {
  const category: TraitCategory | undefined = find(
    traits,
    (t: TraitCategory) => t.name == traitName
  )

  if (!category) {
    throw new Error(`There is no category named [${traitName}]!`)
  }

  const items = category.items

  let sum: number = sumBy(category.items, (i: Trait) => i.weight)
  const threshold: number = Math.random() * sum

  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i].weight

    if (total >= threshold) {
      return items[i].name
    }
  }

  return items[items.length - 1].name
}
