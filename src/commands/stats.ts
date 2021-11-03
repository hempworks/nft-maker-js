import { generateStats } from '../actions'

export const command: string = 'stats'
export const desc: string = 'Generate the statistics for the NFTs'

export const handler = (): void => {
  generateStats()
  process.exit(0)
}
