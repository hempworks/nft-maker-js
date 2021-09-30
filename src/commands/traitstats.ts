import chalk from 'chalk'
import {
  info,
  mapWithKeys,
  resolveConfiguration,
  resolveManifest,
} from '../util'
import type { Arguments, CommandBuilder } from 'yargs'

type Options = {}

export const command: string = 'traits'
export const desc: string = 'Generate trait count statistics for the project'

export const builder: CommandBuilder<Options> = yargs => yargs

export const handler = (argv: Arguments<Options>): void => {
  const config = resolveConfiguration()
  const manifest = resolveManifest()

  // console.log(config, manifest)

  const { traits } = config

  // console.log(traits)

  let fart = new Map()

  traits.forEach(trait => {
    trait.items.forEach(item => {})
    // fart[trait.]
  })
  // let counts = mapWithKeys(traits, (wew, whoa) => {
  //   console.log(whoa)
  //   return
  // })

  // info(chalk.blue(`Generating NFT manifest with ${amount} items...`))
  //
  // fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
  //   flag: 'w',
  // })
  //
  // log(chalk.green(`Finished generating NFT manifest.`))
  process.exit(0)
}
