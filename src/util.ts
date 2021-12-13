import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { ProjectConfiguration, TraitItem, TraitCategoryConfiguration } from './defs'

export function info(msg: string): any {
  return console.info(msg)
}

export function fail(msg: string) {
  info(chalk.red(msg))
  process.exit(1)
}

export function resolveConfiguration(): ProjectConfiguration {
  let configLocation = path.resolve('./config.js')

  if (fs.existsSync(configLocation)) {
    return require(configLocation)
  }

  throw Error(`Could not find the project configuration at: ${configLocation}`)
}

export function resolveManifest() {
  let manifestLocation = path.resolve('./manifest.json')

  if (fs.existsSync(manifestLocation)) {
    let rawData = fs.readFileSync(manifestLocation)
    return JSON.parse(rawData.toString())
  }

  fail('Could not find the project manifest.')
}

export function getTraitCategoryConfiguration(trait: string) {
  const { traits } = resolveConfiguration()

  const singleTraitConfig: TraitCategoryConfiguration = traits.filter(
    (t: TraitCategoryConfiguration) => t.name === trait
  )[0]

  if (!singleTraitConfig) {
    throw Error(`Could not find single trait configuration for: ${trait}`)
  }

  return singleTraitConfig
}

export function getTraitItemConfiguration(category: string, itemName: string): TraitItem {
  const itemConfig = getTraitCategoryConfiguration(category)

  console.log('poop', itemName, itemConfig.name)

  const item = itemConfig.items.filter((itemConfigItem: { name: string }) => {
    return itemConfigItem.name == itemName
  })[0]

  if (!item) {
    throw Error(`Could not find single trait item configuration for: ${category}`)
  }

  return item
}

export function shouldIncludeTraitInMetadata(trait: string) {
  const { order } = resolveConfiguration()

  if (trait == 'tokenId') return false

  const foundInOrderConfig = order.includes(trait)

  const singleTrait = getTraitCategoryConfiguration(trait)

  if (foundInOrderConfig) {
    if (singleTrait.options?.exclude !== undefined) {
      return !singleTrait.options.exclude
    }

    return true
  }
}

export function shouldOutputTrait(trait: string) {
  if (trait == 'tokenId') return false

  const { order } = resolveConfiguration()
  const foundInOrderConfig = order.includes(trait)
  const singleTrait = getTraitCategoryConfiguration(trait)

  if (foundInOrderConfig) {
    if (singleTrait.options?.metadataOnly !== undefined) {
      return !singleTrait.options.metadataOnly
    }

    return true
  }
}
