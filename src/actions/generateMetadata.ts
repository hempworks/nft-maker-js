import { Attribute } from '../defs'
import {
  resolveConfiguration,
  resolveManifest,
  shouldIncludeTrait,
} from '../util'
import fs from 'fs'
import delay from 'delay'
import { tap } from 'lodash'

const manifest = resolveManifest()
const config = resolveConfiguration()

export default async function (
  task: null | {
    output: string
    title: string
  }
): Promise<void> {
  // Generate assets folder...
  if (task) {
    task.output = 'Generating assets folder...'
  }

  if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets')
  }

  // Generate asset metadata...
  for (const item of manifest) {
    const { tokenId } = item as any
    const fileNumber = tokenId - 1
    let filePath = `./assets/${fileNumber}.json`

    tap(createToken(tokenId, item), token => {
      if (task) {
        task.output = `Generating asset metadata '${filePath}'`
      }
      fs.writeFileSync(filePath, JSON.stringify(token, null, 2), { flag: 'w' })
    })

    await delay(10)
  }
}

function createToken(number: number, item: Attribute) {
  const token = {
    name: `${config.name} #${number}`,
    symbol: config.symbol ?? '',
    description: config.description,
    seller_fee_basis_points: config.sellerFeeBasisPoints,
    image: 'image.png',
    external_url: '',
    attributes: [],
    collection: config.collection.name,
    properties: {
      files: [
        {
          uri: 'image.png',
          type: 'image/png',
        },
      ],
    },
    category: 'image',
    creators: config.creators,
  }

  Object.keys(item).forEach((k: string) => {
    if (shouldIncludeTrait(k)) {
      // @ts-ignore
      token['attributes'].push({ trait_type: k, value: item[k] })
    }
  })

  return token
}
