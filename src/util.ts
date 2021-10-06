import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { TraitCategory } from './defs'

export function info(msg: string): any {
  return console.info(msg)
}

export function fail(msg: string) {
  info(chalk.red(msg))
  process.exit(1)
}

export function validUnique(u: object) {
  const { traits } = resolveConfiguration()
  const traitKeys = traits.map((t: TraitCategory) => t.name)

  Object.keys(u).forEach(trait => {
    if (!traitKeys.includes(trait)) {
      fail(`Invalid unique: ${trait}`)
    }
  })

  return true
}

export function resolveConfiguration() {
  // let configLocation = path.resolve()

  return require('./config.js')
  // return fs.existsSync(configLocation)
  //   ? require(configLocation)
  //   : fail('Could not find the project configuration.')
}

export function resolveManifest() {
  let manifestLocation = path.resolve('./manifest.json')

  if (fs.existsSync(manifestLocation)) {
    let rawData = fs.readFileSync(manifestLocation)
    return JSON.parse(rawData.toString())
  }

  fail('Could not find the project manifest.')
}

export function shouldIncludeTrait(trait: string) {
  const { traits } = resolveConfiguration()

  if (['tokenId'].includes(trait)) return false

  const included = traits.map((t: TraitCategory) => t.name).includes(trait)

  let traitConfig = traits.filter((t: TraitCategory) => t.name === trait)[0]

  if (!traitConfig.hasOwnProperty('options')) {
    traitConfig.options = {}
  }

  if (!traitConfig.options.hasOwnProperty('exclude')) {
    traitConfig.options.exclude = false
  }

  return included && !traitConfig.options.exclude
}
