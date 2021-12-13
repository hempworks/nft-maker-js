export interface TraitCategoryConfiguration {
  name: string
  items: TraitItem[]
  options?: {
    exclude: boolean
    metadataOnly: boolean
  }
}

export interface ManifestImageItem {
  tokenId?: number
  name: string
  image: string
}

export interface ManifestItem {
  [key: string | number]: ManifestImageItem
}

export interface Unique {
  [key: string]: UniqueDefinition
}

export interface UniqueDefinition {
  name: string
  image?: string
}

export interface TraitItem {
  name: string
  image?: string
  weight: number
  conflicts?(name: string, value: string): boolean
}

export interface Attribute {
  [key: string]: string | number
}

export interface Task {
  title: string
  output: string
}

export interface Count {
  [key: string]: CountCategory
}

export interface CountCategory {
  [key: string | number]: number
}

export interface Creator {
  address: string
  share: number
}

export interface Collection {
  name: string
  family: string
}

interface Size {
  width: number
  height: number
}

export interface Token {
  name: string
  symbol: string
  description: string
  seller_fee_basis_points: number
  collection: Collection
  creators: Creator[]
}

export interface ProjectConfiguration {
  editionSize: number
  name: string
  symbol?: string
  description: string
  collection: Collection
  size: Size
  sellerFeeBasisPoints: number
  allowDuplicates?: boolean
  creators: Creator[]
  order: string[]
  uniques: UniqueDefinition[]
  traits: TraitCategoryConfiguration[]
}
