import { Listr } from 'listr2'
import delay from 'delay'
import path from 'path'
import fs from 'fs'
import { Arguments, CommandBuilder } from 'yargs'

export const command: string = 'init'

export const desc: string =
  'Initialize a configuration file based on the traits folder'

type Options = {
  force: boolean
}

export const builder: CommandBuilder<Options> = yargs =>
  yargs.option('force', {
    alias: 'f',
    demandOption: true,
    default: false,
    type: 'boolean',
    describe: 'Force creation of the configuration file',
  })

function getTasks(force: boolean) {
  return new Listr(
    [
      {
        title: 'Checking for existing configuration file...',
        task: async (ctx, task): Promise<void> => {
          await delay(500)

          let configPath = path.resolve('./config.js')
          let configPathExists = fs.existsSync(configPath)

          if (configPathExists && force) {
            task.title = 'Forcing overwrite of configuration file.'
          }

          if (configPathExists && !force) {
            task.title =
              'Configuration file already configPathExists. Skipping!'
            ctx.skip = true
          }

          if (!configPathExists) {
            task.title = 'No configuration file found. Creating one...'
          }
        },
      },
      {
        title: 'Writing configuration file...',
        skip: (ctx): boolean => ctx.skip,
        task: async (ctx, task): Promise<void> => {
          await delay(500)

          const traitsPath = path.resolve('./traits')
          const traitsPathExists = fs.existsSync(traitsPath)
          let stub = require('../../config.stub')

          // If we're here it's because we're either forcing the creation of the configuration file or we're creating a new one. The only concern is if we have a traits folder or not.

          if (traitsPathExists) {
            task.title = 'Traits folder exists...writing configuration.'

            let traits = fs.readdirSync(traitsPath)

            stub.traits = traits
              .filter(t => t !== '.DS_Store')
              .map(trait => {
                let itemsPath = path.resolve(`./traits/${trait}`)
                let items = fs
                  .readdirSync(itemsPath)
                  .filter(item => !/(^|\/)\.[^\/\.]/g.test(item))

                return {
                  name: trait,
                  items: items.map(item => {
                    return { name: item.replace('.png', ''), weight: 10 }
                  }),
                }
              })
          } else {
            task.title =
              "Traits folder doesn't exist. Generated a default configuration file."

            stub.uniques = [
              {
                Background: { name: 'Black' },
                Foreground: { name: 'White' },
              },
            ]

            stub.traits = [
              {
                name: 'Background',
                items: [
                  { name: 'Black', weight: 20 },
                  { name: 'White', weight: 20 },
                ],
              },
              {
                name: 'Foreground',
                items: [
                  { name: 'Black', weight: 20 },
                  { name: 'White', weight: 20 },
                ],
              },
            ]
          }

          fs.writeFileSync(
            './config.js',
            'module.exports = ' + JSON.stringify(stub, null, 2),
            {
              flag: 'w',
            }
          )
        },
      },
    ],
    { concurrent: false }
  )
}

export const handler = (argv: Arguments<Options>): void => {
  getTasks(argv.force)
    .run()
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      process.exit(0)
    })
}
