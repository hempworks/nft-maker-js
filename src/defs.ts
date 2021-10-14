export interface TraitCategory {
  name: string
  items: Trait[]
}

// type IncompatibleTrait = {}
// export interface IncompatibleTrait: string | string[]

export interface Incompatible {
  [key: string]: string | string[]
}

export interface Trait {
  name: string
  weight: number
  incompatible?: Incompatible
}

export interface Attribute {
  [name: string]: string | number
}

export interface Image {
  [name: string]: string | number
}
