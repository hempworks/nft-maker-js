import { Listr } from 'listr2'

import { generateManifest, generateStats, generateMetadata, generateImages } from '../actions'

export const command: string = 'run'
export const desc: string = 'Run the generator'

const tasks = new Listr([
  {
    title: 'Generate Manifest',
    task: async (ctx, task): Promise<void> => {
      await generateManifest()
    },
  },
  {
    title: 'Generate Stats',
    task: generateStats,
  },
  {
    title: 'Generate Metadata',
    task: async (ctx, task): Promise<void> => {
      await generateMetadata(task)
    },
  },
  {
    title: 'Generate Images',
    task: async (ctx, task): Promise<void> => {
      await generateImages(task)
    },
  },
])

export const handler = (): void => {
  tasks
    .run()
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      process.exit(0)
    })
}
