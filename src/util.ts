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

export function resolveConfiguration() {
  let configLocation = path.resolve('./config.js')

  return fs.existsSync(configLocation)
    ? require(configLocation)
    : fail('Could not find the project configuration.')
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
  return resolveConfiguration()
    .traits.map((t: TraitCategory) => t.name)
    .includes(trait)
}
