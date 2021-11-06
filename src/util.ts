import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { TraitCategory } from './defs'

export function info(msg: string): any {
  return console.info(msg)
}

export function dd(...what: any[]) {
  console.log(...what)
  process.exit(1)
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

export function getSingleTraitConfiguration(trait: string) {
  const { traits } = resolveConfiguration()

  return traits.filter((t: TraitCategory) => t.name === trait)[0]
}

export function getSingleTraitItemConfiguration(
  category: string,
  itemName: string
) {
  let itemConfig = getSingleTraitConfiguration(category)

  return itemConfig.items.filter((itemConfigItem: { name: string }) => {
    return itemConfigItem.name == itemName
  })[0]
}

export function shouldIncludeTraitInMetadata(trait: string) {
  const { order } = resolveConfiguration()

  if (trait == 'tokenId') return false

  const foundInOrderConfig = order.includes(trait)

  const singleTrait = getSingleTraitConfiguration(trait)

  if (foundInOrderConfig) {
    if (singleTrait.options?.exclude !== undefined) {
      return !singleTrait.options?.exclude
    }

    if (singleTrait.options?.metadatOnly !== undefined) {
      return singleTrait.options?.metadataOnly
    }

    return true
  }
}
