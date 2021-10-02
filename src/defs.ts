export interface TraitCategory {
  name: string
  items: Array<Trait>
}

export interface Trait {
  name: string
  weight: number
}

export interface Attribute {
  tokenId: string
  [name: string]: any
}
