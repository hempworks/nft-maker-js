import chalk from 'chalk'
import { info, resolveConfiguration, resolveManifest } from '../util'
import type { Arguments, CommandBuilder } from 'yargs'
import { Trait, TraitCategory } from '../defs'
import fs from 'fs'

type Options = {
  amount: number
}

export const command: string = 'run <amount>'
export const desc: string = 'Run the generator'

export const builder: CommandBuilder<Options> = yargs =>
  yargs.positional('amount', { type: 'string', demandOption: true })

export const handler = (argv: Arguments<Options>): void => {
  // info(chalk.blue(`Generating NFT trait statistics...`))

  // Run all the steps

  // info(chalk.green(`Finished generating NFT trait statistics.`))
  process.exit(0)
}
