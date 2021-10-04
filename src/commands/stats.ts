import type { Arguments } from 'yargs'
import { generateStats } from '../actions'

export const command: string = 'stats'
export const desc: string = 'Generate trait count statistics for the project'

export const handler = (argv: Arguments): void => {
  generateStats()
  process.exit(0)
}
