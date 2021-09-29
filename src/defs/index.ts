export interface TraitCategory {
  name: string
  items: Array<Trait>
}

export interface Trait {
  name: string
  weight: number
}

export interface Attribute {
  [name: string]: any
}
