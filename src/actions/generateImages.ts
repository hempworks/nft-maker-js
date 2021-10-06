import sharp from 'sharp'
import { resolveManifest, shouldIncludeTrait } from '../util'
import path from 'path'
import { fail } from '../util'

function createImage() {
  return sharp({
    create: {
      width: 2000,
      height: 2000,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
}

function compositeImage(image: sharp.Sharp, item: any) {
  image.composite(
    Object.keys(item)
      .filter((key: string) => key !== 'tokenId')
      .map((key: string) => ({
        input: path.resolve(`./traits/${key}/${item[key]}.png`),
        gravity: 'center',
      }))
  )
}

export default async function (
  task: null | {
    title: string
    output: string
  }
): Promise<void> {
  const manifest = resolveManifest()

  for (const item of manifest) {
    const key: number = manifest.indexOf(item)
    const filePath = `./assets/${key}.png`

    if (task) {
      task.output = `Creating image at '${filePath}'`
    }

    const image = createImage()

    compositeImage(image, item)

    try {
      await image.toFile(filePath)
    } catch (err) {
      fail(`Failed to generate ${filePath}`)
    }
  }
}
