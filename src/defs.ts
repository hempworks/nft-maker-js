export interface TraitCategory {
  name: string
  items: Trait[]
}

export interface Trait {
  name: string
  weight: number
}

export interface Attribute {
  [name: string]: string | number
}

export interface Image {
  [name: string]: string | number
}
