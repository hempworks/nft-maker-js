import sharp from 'sharp'
import { resolveManifest, shouldIncludeTrait } from '../util'
import { Attribute } from '../defs'
import path from 'path'
import { info, fail } from '../util'

export default function () {
  info('Generating NFT images...')
  const manifest = resolveManifest()

  manifest.forEach((item: Attribute, key: number) => {
    const image = sharp({
      create: {
        width: 2000,
        height: 2000,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })

    image.composite(
      Object.keys(item)
        .filter((key: string) => shouldIncludeTrait(key))
        .map((key: string) => ({
          input: path.resolve(`./traits/${key}/${item[key]}.png`),
          gravity: 'center',
        }))
    )

    image
      .toFile(path.resolve(`./assets/${key}.png`))
      .then(() => {
        info(`Generated ${path.resolve(`./assets/${key}.png`)}`)
      })
      .catch(err => {
        fail(`Failed to generate ${path.resolve(`./assets/${key}.png`)}`)
      })
  })

  info('Finished generating NFT images!')
}
