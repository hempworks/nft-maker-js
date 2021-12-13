import fs from 'fs'
import { generateManifest } from '../src/actions'
import { resolveConfiguration } from '../src/util'

jest.mock('fs')
jest.mock('../src/util')

describe('generateManifest', () => {
  it('fails if duplicates are generated', () => {
    const mockResolve = <jest.MockedFunction<typeof resolveConfiguration>>resolveConfiguration

    mockResolve.mockImplementation(() => ({
      collection: {
        name: 'Hemp',
        family: 'Hemp',
      },
      creators: [
        {
          address: '12345',
          share: 100,
        },
      ],
      description: '',
      name: '',
      sellerFeeBasisPoints: 0,
      size: {
        width: 400,
        height: 400,
      },
      editionSize: 200,
      uniques: [],
      order: ['Background', 'Foreground'],
      traits: [
        { name: 'Background', items: [{ name: 'Black', weight: 1 }] },
        { name: 'Foreground', items: [{ name: 'White', weight: 1 }] },
      ],
    }))

    expect(() => generateManifest()).toThrow('Duplicate image found')
  })

  it('does not fail if configured to allow duplicates to be generated', () => {
    const mockResolve = <jest.MockedFunction<typeof resolveConfiguration>>resolveConfiguration

    mockResolve.mockImplementation(() => ({
      collection: {
        name: 'Hemp',
        family: 'Hemp',
      },
      creators: [
        {
          address: '12345',
          share: 100,
        },
      ],
      description: '',
      name: '',
      sellerFeeBasisPoints: 0,
      size: {
        width: 400,
        height: 400,
      },
      editionSize: 200,
      allowDuplicates: true,
      uniques: [],
      order: ['Background', 'Foreground'],
      traits: [
        { name: 'Background', items: [{ name: 'Black', weight: 1 }] },
        { name: 'Foreground', items: [{ name: 'White', weight: 1 }] },
      ],
    }))

    expect(generateManifest()).toEqual(true)
  })

  it('fails with invalid uniques', () => {
    const mockResolve = <jest.MockedFunction<typeof resolveConfiguration>>resolveConfiguration

    // @ts-ignore
    mockResolve.mockImplementation(() => ({
      collection: {
        name: 'Hemp',
        family: 'Hemp',
      },
      creators: [
        {
          address: '12345',
          share: 100,
        },
      ],
      description: '',
      name: '',
      sellerFeeBasisPoints: 0,
      size: {
        width: 400,
        height: 400,
      },
      editionSize: 200,
      allowDuplicates: true,
      uniques: [
        {
          Brain: { name: 'Smol' },
        },
      ],
      order: ['Background', 'Foreground'],
      traits: [
        { name: 'Background', items: [{ name: 'Black', weight: 1 }] },
        { name: 'Foreground', items: [{ name: 'White', weight: 1 }] },
      ],
    }))

    expect(() => generateManifest()).toThrow('Invalid unique found')
  })
})
