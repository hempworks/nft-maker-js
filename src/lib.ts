import { find, sumBy } from 'lodash'
import { TraitCategory, Trait } from './defs'

export function getRandomWeightedTrait(
  traits: Array<TraitCategory>,
  traitName: string
): string {
  const category: TraitCategory | undefined = find(
    traits,
    (t: TraitCategory) => t.name == traitName
  )

  if (!category) {
    throw new Error(`There is no category named [${traitName}]!`)
  }

  const items = category.items

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
