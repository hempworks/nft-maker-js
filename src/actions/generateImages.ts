import sharp from 'sharp'
import {
  fail,
  getSingleTraitConfiguration,
  resolveConfiguration,
  resolveManifest,
} from '../util'
import path from 'path'
import { ImageDefinition, Task } from '../defs'

async function createImage() {
  return await sharp({
    create: {
      width: 2000,
      height: 2000,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .png()
    .toBuffer()
}

async function compositeImage(image: any, item: ImageDefinition) {
  return await sharp(image)
    .composite(
      Object.keys(item)
        .filter((key: string) => shouldOutputTrait(key))
        .map((key: string) => {
          // @ts-ignore
          const fileName = item[key].image || item[key].name
          const pathSegments = `./traits/${key}/${fileName}.png`

          return {
            input: path.resolve(pathSegments),
            gravity: 'center',
          }
        })
    )
    .toBuffer()
}

function shouldOutputTrait(trait: string) {
  if (trait == 'tokenId') {
    return false
  }

  return !getSingleTraitConfiguration(trait).options?.metadataOnly
}

export default async function (task: null | Task): Promise<void> {
  const manifest = resolveManifest()

  for (const item of manifest) {
    const key: number = manifest.indexOf(item)
    const filePath = path.resolve(`./assets/${key}.png`)
    if (task) task.output = `Creating image at '${filePath}'`

    let image = await createImage()

    image = await compositeImage(image, item)

    const { imageOptions } = resolveConfiguration()

    if (imageOptions) {
      image = await Object.keys(imageOptions).reduce(
        async (carry: any, option) => {
          // @ts-ignore
          return await sharp(image)[option](imageOptions[option]).toBuffer()
        },
        []
      )
    }

    try {
      await sharp(image).toFile(filePath)
    } catch (err: any) {
      fail(`Failed to generate image: ${err.toString()}`)
    }
  }
}
