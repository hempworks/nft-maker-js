import { createToken } from '../src/actions/generateMetadata'
import { resolveConfiguration, shouldIncludeTrait } from '../src/util'

jest.mock('../src/util')

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

describe('createToken', () => {
  it('should return a valid token', async () => {
    const resolveConfigMock = <jest.Mock<typeof resolveConfiguration>>(
      resolveConfiguration
    )

    resolveConfigMock.mockReturnValue(testConfig as any)

    const shouldIncludeTraitMock = <jest.Mock<typeof shouldIncludeTrait>>(
      shouldIncludeTrait
    )

    shouldIncludeTraitMock.mockReturnValue(trait => true)

    const token = createToken(
      69,
      {
        Background: 'Midnight',
        Foreground: 'White',
      },
      testConfig
    )

    expect(shouldIncludeTrait).toHaveBeenCalledTimes(2)

    expect(token.name).toEqual('Hemp #69')
    expect(token.description).toEqual('Sexy NFTs')
    expect(token.seller_fee_basis_points).toEqual(500)
    expect(token.collection).toEqual({
      name: 'Hemp (1st Edition)',
      family: 'Hemp',
    })
    expect(token.creators).toEqual([
      {
        address: '1234567890',
        share: 100,
      },
    ])
    expect(token.attributes).toEqual([
      {
        trait_type: 'Background',
        value: 'Midnight',
      },
      {
        trait_type: 'Foreground',
        value: 'White',
      },
    ])
  })
})
