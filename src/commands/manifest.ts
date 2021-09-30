import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import { log } from '../util'
import { times } from 'lodash'
import { Attribute } from '../defs'
import { createNewUniqueImage } from '../lib'
import type { Arguments, CommandBuilder } from 'yargs'

type Options = {
  amount: number
}

export const command: string = 'manifest <amount>'
export const desc: string = 'Generate an NFT configuration manifest'

export const builder: CommandBuilder<Options> = yargs =>
  yargs.positional('amount', { type: 'string', demandOption: true })

export const handler = (argv: Arguments<Options>): void => {
  const { amount } = argv

  let configLocation = path.resolve('./project.config.js')

  if (!fs.existsSync(configLocation)) {
    log(chalk.red('There is no project.config.js in this folder.'))
    process.exit(1)
  }

  const { traits, editionSize } = require(configLocation)

  log(chalk.blue(`Generating NFT manifest with ${amount} items...`))

  let imageData: Array<Attribute> = times(editionSize, () =>
    createNewUniqueImage(traits)
  )

  fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
    flag: 'w',
  })

  log(chalk.green(`Finished generating NFT manifest.`))
  process.exit(0)
}
