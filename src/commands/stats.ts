import chalk from 'chalk'
import { info, resolveConfiguration, resolveManifest } from '../util'
import type { Arguments, CommandBuilder } from 'yargs'
import { Trait, TraitCategory } from '../defs'
import fs from 'fs'

export const command: string = 'stats'
export const desc: string = 'Generate trait count statistics for the project'

export const builder: CommandBuilder = yargs => yargs

export const handler = (argv: Arguments): void => {
  info(chalk.blue(`Generating NFT trait statistics...`))

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
    Object.entries(item).forEach(v => {
      counts[v[0]][v[1]]++
    })
  })

  fs.writeFileSync('./stats.json', JSON.stringify(counts, null, 2), {
    flag: 'w',
  })

  info(chalk.green(`Finished generating NFT trait statistics.`))
  process.exit(0)
}
