import { times } from 'lodash'
import { Attribute } from '../defs'
import { createNewUniqueImage } from '../lib'
import { writeFile } from 'fs'
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
  process.stdout.write(`Generating NFT manifest with ${amount} items...`)

  let { traits, editionSize } = require(`${__dirname}/../../project.config.js`)

  let imageData: Array<Attribute> = times(editionSize, () =>
    createNewUniqueImage(traits)
  )

  writeFile(
    './manifest.json',
    JSON.stringify(imageData, null, 2),
    {
      flag: 'wx',
    },
    err => {
      if (err) throw err

      console.log('It already exists!')
    }
  )

  process.exit(0)
}
