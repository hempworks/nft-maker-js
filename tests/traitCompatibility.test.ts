import fs from 'fs'
import { generateManifest } from '../src/actions'
import { getTraitItemConfiguration, resolveConfiguration } from '../src/util'
import { traitIsCompatibleWithCurrentImage } from '../src/actions/generateManifest'
import { ManifestItem, TraitCategoryConfiguration, TraitItem } from '../src/defs'

jest.mock('fs')
jest.mock('../src/util')

describe('traitIsCompatibleWithCurrentImage', () => {
  it('confirms a proposed trait is compatible', async () => {
    // const resolveConfigMock = <jest.MockedFunction<typeof resolveConfiguration>>resolveConfiguration
    //
    // resolveConfigMock.mockImplementation(() => ({
    //   collection: {
    //     name: 'Hemp',
    //     family: 'Hemp',
    //   },
    //   creators: [
    //     {
    //       address: '12345',
    //       share: 100,
    //     },
    //   ],
    //   description: '',
    //   name: '',
    //   sellerFeeBasisPoints: 0,
    //   size: {
    //     width: 400,
    //     height: 400,
    //   },
    //   editionSize: 200,
    //   uniques: [],
    //   order: ['Background', 'Foreground'],
    //   traits: [
    //     { name: 'Background', items: [{ name: 'Black', weight: 1 }] },
    //     { name: 'Foreground', items: [{ name: 'White', weight: 1 }] },
    //   ],
    // }))

    // const getTraitItemConfigMock = <jest.MockedFunction<typeof getTraitItemConfiguration>>getTraitItemConfiguration

    // let getSingleTraitItemConfigurationMockResult = {
    //   name: 'Background',
    //   weight: 1,
    //   items: [{ name: 'Black' }],
    //   conflicts: () => false,
    // }
    //
    // const testConfig = {
    //   traits: [
    //     getSingleTraitItemConfigurationMockResult,
    //     {
    //       name: 'Foreground',
    //       weight: 1,
    //       items: [{ name: 'White', conflicts: () => false }],
    //     },
    //   ],
    // }
    //
    // resolveConfigMock.mockReturnValue(testConfig as any)
    // getTraitItemConfigMock.mockReturnValue(getSingleTraitItemConfigurationMockResult as any)

    let backgroundCategory: TraitCategoryConfiguration = {
      name: 'Background',
      items: [{ name: 'Black', weight: 1 }],
    }

    let maybeTrait: TraitItem = { name: 'White', weight: 1 }

    let existingImage: ManifestItem = {
      Background: { name: 'Black', image: 'Black' },
    }

    let result = traitIsCompatibleWithCurrentImage(backgroundCategory, maybeTrait, existingImage)

    expect(result).toBe(true)
  })

  it('confirms a proposed trait is backwards incompatible', () => {
    let backgroundCategory: TraitCategoryConfiguration = { name: 'Background', items: [{ name: 'Black', weight: 1 }] }
    let maybeTrait: TraitItem = { name: 'White', weight: 1, conflicts: () => true }
    let existingImage: ManifestItem = { Background: { name: 'Black', image: 'Black' } }

    expect(traitIsCompatibleWithCurrentImage(backgroundCategory, maybeTrait, existingImage)).toBe(false)
  })

  it('confirms a proposed trait is forwards incompatible', () => {
    let backgroundCategory: TraitCategoryConfiguration = {
      name: 'Background',
      items: [{ name: 'Black', weight: 1, conflicts: () => true }],
    }
    let maybeTrait: TraitItem = { name: 'White', weight: 1 }
    let existingImage: ManifestItem = { Background: { name: 'Black', image: 'Black' } }

    expect(traitIsCompatibleWithCurrentImage(backgroundCategory, maybeTrait, existingImage)).toBe(false)
  })
})
