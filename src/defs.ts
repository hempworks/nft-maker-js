export interface TraitCategory {
  name: string
  items: Trait[]
}

export interface ImageDefinition {
  name: string
  image?: string
}

// type IncompatibleTrait = {}
// export interface IncompatibleTrait: string | string[]

export interface Incompatible {
  [key: string]: string | string[]
}

export interface Trait {
  name: string
  image?: string
  weight: number
  conflicts?(name: string, value: string): boolean
}

export interface Attribute {
  [name: string]: string | number
}

export interface Image {
  [key: string]: string | number
}

export interface Task {
  title: string
  output: string
}
