import { traitIsCompatibleWithCurrentImage } from '../src/actions/generateManifest'
import { resolveConfiguration } from '../src/util'

jest.mock('../src/util')

const testConfig = {
  name: 'Hemp',
  description: 'Sexy NFTs',
  maxAttempts: 40,
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
  traits: [
    {
      name: 'Background',
      items: [
        { name: 'Midnight', weight: 20 }, // Not compatible
        { name: 'Blue', weight: 20 }, // Compatible
      ],
    },

    {
      name: 'Foreground',
      items: [
        { name: 'Red', weight: 20, incompatible: { Background: ['Midnight'] } },
        { name: 'White', weight: 20 },
      ],
    },
  ],
}
const { traits } = testConfig

describe('traitIsCompatibleWithCurrentImage', () => {
  it('confirms a proposed trait is compatible', async () => {
    const resolveConfigMock = <jest.Mock<typeof resolveConfiguration>>(
      resolveConfiguration
    )

    resolveConfigMock.mockReturnValue(testConfig as any)

    let existing = {
      Background: 'Midnight',
    }

    let result = traitIsCompatibleWithCurrentImage(
      { name: 'Red', weight: 10, incompatible: { Background: ['Midnight'] } },
      existing
    )

    expect(result).toBe(true)
  })

  it('confirms a proposed trait is incompatible', async () => {
    const resolveConfigMock = <jest.Mock<typeof resolveConfiguration>>(
      resolveConfiguration
    )

    resolveConfigMock.mockReturnValue(testConfig as any)

    let existing = {
      Background: 'Midnight',
    }

    let result = traitIsCompatibleWithCurrentImage(
      { name: 'Red', weight: 10, incompatible: { Background: ['Midnight'] } },
      existing
    )

    expect(result).toBe(false)
  })
})
