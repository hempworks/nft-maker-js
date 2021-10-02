import { Attribute, TraitCategory } from '../defs'
import {
  info,
  resolveConfiguration,
  resolveManifest,
  shouldIncludeTrait,
} from '../util'
import fs from 'fs'

const manifest = resolveManifest()
const config = resolveConfiguration()

export default function handle() {
  manifest.forEach((item: Attribute) => {
    const { tokenId } = item as any
    const fileNumber = tokenId - 1

    const token = createToken(tokenId, item)

    if (!fs.existsSync('./assets')) {
      fs.mkdirSync('./assets')
    }

    fs.writeFileSync(
      `./assets/${fileNumber}.json`,
      JSON.stringify(token, null, 2),
      {
        flag: 'w',
      }
    )

    info(`Generated '/assets/${fileNumber}.json'`)
  })
}

function createToken(number: number, item: Attribute) {
  const token = {
    name: `${config.name} #${number}`,
    symbol: '',
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
