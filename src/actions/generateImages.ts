import sharp from 'sharp'
import { resolveManifest, shouldIncludeTrait } from '../util'

export default function () {
  const manifest = resolveManifest()

  manifest.map((item: object, key: number) => {
    let image = sharp({
      create: {
        width: 2000,
        height: 2000,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })

    Object.keys(item).forEach(key => {
      // console.log(shouldIncludeTrait(key))
      // if (shouldIncludeTrait(key)) {
      let imageName = `./traits/${key}.png`
      image = image.composite([{ input: imageName, gravity: 'center' }])
      // }
    })

    image.toFile(`./assets/${key}.png`, function (err) {
      console.log('error: ', err)
    })
  })
}
