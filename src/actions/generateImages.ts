import sharp from 'sharp'
import { fail, getSingleTraitConfiguration, resolveManifest } from '../util'
import path from 'path'
import { Task, ImageDefinition } from '../defs'

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

function compositeImage(image: sharp.Sharp, item: ImageDefinition) {
  image.composite(
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

    const image = createImage()

    await compositeImage(image, item)

    // const { imageOptions } = resolveConfiguration()
    // if (imageOptions !== undefined && imageOptions.length > 0) {
    // Object.keys(imageOptions).forEach(option => {
    //   // @ts-ignore
    //   image[option](imageOptions[option])
    //   image.resize(2000, 2000)
    // })
    // }

    // image.extract({
    //   left: 0,
    //   top: 100,
    //   width: 2000,
    //   height: 2000,
    // })
    //

    // image.resize(1000, 1000, { fit: 'cover' })

    try {
      await image.toFile(filePath)
    } catch (err: any) {
      fail(`Failed to generate ${filePath}: ${err.toString()}`)
    }
  }
}
