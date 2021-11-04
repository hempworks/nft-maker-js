import {
  resolveConfiguration,
  resolveManifest,
  shouldIncludeTraitInMetadata,
} from '../util'
import { Trait, TraitCategory } from '../defs'
import fs from 'fs'

export default function () {
  const config = resolveConfiguration()
  const manifest = resolveManifest()
  const { order, traits: t } = config
  const categories: Array<TraitCategory> = t

  let counts = order
    .map((cat: string) => {
      const category: TraitCategory = categories.filter(c => c.name == cat)[0]

      return {
        [cat]: category.items
          .map((trait: Trait) => ({ [trait.name]: 0 }))
          .reduce((carry, trait) => {
            return {
              ...carry,
              ...trait,
            }
          }, {}),
      }
    })
    .reduce((carry: object, poop: object) => {
      return {
        ...carry,
        ...poop,
      }
    }, {})

  manifest.forEach((item: object) => {
    Object.entries(item).forEach(value => {
      if (shouldIncludeTraitInMetadata(value[0])) {
        counts[value[0]][value[1]]++
      }
    })
  })

  fs.writeFileSync('./stats.json', JSON.stringify(counts, null, 2), {
    flag: 'w',
  })
}
