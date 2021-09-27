// import chalk from 'chalk'
import times from 'lodash/times'
import map from 'lodash/map'

// Load the configuration file provided by the user...
let { traits, uniques, editionSize } = require('../hemps.config.js')

let imageData: Array<string> = times(editionSize, () => {
  return createNewUniqueImage()
})

function createNewUniqueImage() {
  return createNewImage()
}

function createNewImage() {
  return traits.map(t => {})
}

// function isCompatible(fn: () => boolean) {
//   return true
// }

function getRandomTrait(fn: () => string) {
  return traits[0]
}

// function getRandomWeightedElement() {

// }

// function weightFunction(items) {
//   var cumul = 100
//   var random = Math.floor(Math.random() * 100)
//
//   for (var i = 0; i < items.length; i++) {
//     cumul -= items[i].weight
//     if (random >= cumul) {
//       return items[i]
//     }
//   }
// }

// console.log(imageData)
