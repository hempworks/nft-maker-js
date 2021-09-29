import { times, map, transform, reduce, find, sumBy } from 'lodash'
import { TraitCategory, Trait, Attribute } from './defs'
import { createNewUniqueImage } from './lib'
import { writeFileSync } from 'fs'

let { traits: t, uniques, editionSize } = require('../project.config.js')
const traits: Array<TraitCategory> = t

let imageData: Array<Attribute> = times(editionSize, () =>
  createNewUniqueImage(traits)
)

let manifest = JSON.stringify(imageData, null, 2)

writeFileSync('/manifest.json', manifest)
