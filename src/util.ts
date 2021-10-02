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

export function warn(msg: string) {
  console.warn(chalk.yellow(msg))
}

export function success(msg: string) {
  info(chalk.bgGreen.white(msg))
}

export function resolveConfiguration() {
  let configLocation = path.resolve('./config.js')

  return fs.existsSync(configLocation)
    ? require(configLocation)
    : fail('Could not find the project configuration.')
}

export function resolveManifest() {
  let manifestLocation = path.resolve('./manifest.json')

  return fs.existsSync(manifestLocation)
    ? require(manifestLocation)
    : fail('Could not find the project manifest.')
}

export function mapWithKeys(myObject: any, iterator: Function) {
  return Object.keys(myObject).map((key, index) => {
    return iterator(key, index)
  })
}

export function shouldIncludeTrait(trait: string) {
  return resolveConfiguration()
    .traits.map((t: TraitCategory) => t.name)
    .includes(trait)
}
