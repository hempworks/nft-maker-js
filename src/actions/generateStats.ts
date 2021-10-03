import {
  info,
  resolveConfiguration,
  resolveManifest,
  success,
  shouldIncludeTrait,
} from '../util'
import { Trait, TraitCategory } from '../defs'
import fs from 'fs'

export default function () {
  info('Generating NFT trait statistics...')

  const config = resolveConfiguration()
  const manifest = resolveManifest()
  const { traits: t } = config
  const categories: Array<TraitCategory> = t

  let counts = categories
    .map((cat: TraitCategory) => {
      return {
        [cat.name]: cat.items
          .map((trait: Trait) => ({ [trait.name]: 0 }))
          .reduce((carry, trait) => {
            return {
              ...carry,
              ...trait,
            }
          }, {}),
      }
    })
    .reduce((carry, poop) => {
      return {
        ...carry,
        ...poop,
      }
    })

  manifest.forEach((item: object) => {
    Object.entries(item).forEach(value => {
      if (shouldIncludeTrait(value[0])) {
        counts[value[0]][value[1]]++
      }
    })
  })

  fs.writeFileSync('./stats.json', JSON.stringify(counts, null, 2), {
    flag: 'w',
  })

  success('Finished generating NFT trait statistics.')
}
