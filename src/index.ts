// import chalk from 'chalk'
import times from 'lodash/times'
import map from 'lodash/map'
import transform from 'lodash/transform'
import reduce from 'lodash/reduce'

interface Trait {
  name: string
  weight: number
}

// Load the configuration file provided by the user...
let { traits: t, uniques, editionSize } = require('../project.config.js')
const traits: Array<Trait> = t

let imageData = times(editionSize, () => {
  return createNewUniqueImage()
})

console.log(imageData)

function createNewUniqueImage() {
  return createNewImage()
}

function createNewImage() {
  return transform(traits, (result, { name }, key) => {
    return [name, getRandomTrait(name)]
  })
}

function getRandomTrait(trait: string) {
  // return traits[trait]
  return getRandomWeightedElement(trait)
}

function getRandomWeightedElement(trait: string) {
  // const items: Trait = traits[trait as any]
  // const sum = reduce(items, i => i.weight)
  console.log(traits[trait])
  // var cumul = 100
  // var random = Math.floor(Math.random() * 100)
  //
  // for (var i = 0; i < items.length; i++) {
  //   cumul -= items[i].weight
  //   if (random >= cumul) {
  //     return items[i]
  //   }
  // }
}
