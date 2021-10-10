import { createToken } from '../src/actions/generateMetadata'
import {
  createNewUniqueImage,
  // createNewImage,
  // getNumberOfAttempts,
} from '../src/actions/generateManifest'

import { resolveConfiguration, shouldIncludeTrait } from '../src/util'

jest.mock('../src/util')
// jest.mock('../src/actions/generateManifest')

const testConfig = {
  name: 'Hemp',
  description: 'Sexy NFTs',
  sellerFeeBasisPoints: 500,
  creators: [
    {
      address: '1234567890',
      share: 100,
    },
  ],
  collection: {
    name: 'Hemp (1st Edition)',
    family: 'Hemp',
  },
  order: ['Background', 'Foreground'],
  traits: [
    {
      name: 'Background',
      items: [
        { name: 'Midnight', weight: 20 },
        { name: 'Blue', weight: 20 },
      ],
    },

    {
      name: 'Foreground',
      items: [
        { name: 'Red', weight: 20 },
        { name: 'White', weight: 20 },
      ],
    },
  ],
}
const { traits } = testConfig

describe('createNewUniqueImage', () => {
  it('fails after 400 tries for a unique', () => {
    const resolveConfigMock = <jest.Mock<typeof resolveConfiguration>>(
      resolveConfiguration
    )

    resolveConfigMock.mockReturnValue(testConfig as any)

    // const createNewImageMock = <jest.Mock<typeof createNewImage>>createNewImage
    // const getNumberOfAttemptsMock = <jest.Mock<typeof getNumberOfAttempts>>(
    //   getNumberOfAttempts
    // )
    // const getNumberOfAttemptsMock = jest.fn() as jest.MockedFunction<
    //   typeof getNumberOfAttempts
    // >
    // getNumberOfAttemptsMock.mockReturnValue(500)

    // const throwError = () => {

    //   throw Error('Poop!')
    // }

    expect(() => {
      createNewUniqueImage(traits)
    }).toThrowError()
  })
})
