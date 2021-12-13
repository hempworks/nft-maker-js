import sharp from 'sharp'
import {
  fail,
  resolveConfiguration,
  resolveManifest,
  shouldOutputTrait,
} from '../util'
import path from 'path'
import { ManifestItem, Task } from '../defs'

async function createImage(): Promise<Buffer> {
  const { size } = resolveConfiguration()

  return await sharp({
    create: {
      width: size.width,
      height: size.height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .png()
    .toBuffer()
}

async function compositeImage(
  image: Buffer,
  item: ManifestItem
): Promise<Buffer> {
  return await sharp(image)
    .composite(
      Object.keys(item)
        .filter((key: string) => shouldOutputTrait(key))
        .map((key: string) => {
          const fileName = item[key].image || item[key].name
          const pathSegments = `./traits/${key}/${fileName}.png`

          return { input: path.resolve(pathSegments), gravity: 'center' }
        })
    )
    .toBuffer()
}

export default async function (task: null | Task): Promise<void> {
  const manifest = resolveManifest()

  for (const item of manifest) {
    const key: number = manifest.indexOf(item)
    const filePath: string = path.resolve(`./assets/${key}.png`)
    if (task) task.output = `Creating image at '${filePath}'`

    let image: Buffer = await createImage()

    image = await compositeImage(image, item)

    try {
      await sharp(image).toFile(filePath)
    } catch (err: any) {
      fail(`Failed to generate image: ${err.toString()}`)
    }
  }
}
