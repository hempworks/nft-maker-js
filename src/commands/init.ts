import { Listr } from 'listr2'
import delay from 'delay'
import path from 'path'
import fs from 'fs'
import { Arguments, CommandBuilder } from 'yargs'

export const command: string = 'init'

// @ts-ignore
export const desc: string =
  'Initialize a configuration file based on the traits folder'

type Options = {
  force: boolean
}

// @ts-ignore
export const builder: CommandBuilder<Options> = yargs => {
  yargs.option('force', {
    alias: 'f',
    demandOption: true,
    default: false,
    type: 'boolean',
    describe: 'Force creation of the configuration file',
  })
}

// @ts-ignore
function getTasks(force: boolean) {
  return new Listr(
    [
      {
        title: 'Checking for existing configuration file...',
        task: async (ctx, task): Promise<void> => {
          await delay(500)

          let configPath = path.resolve('./config.js')

          let exists = fs.existsSync(configPath)

          if (exists && force) {
            task.title = 'Forcing overwrite of configuration file.'
          }

          if (exists && !force) {
            task.title = 'Configuration file already exists. Skipping!'
            // @ts-ignore
            ctx.skip = true
          }

          if (!exists) {
            task.title = 'No configuration file found. Creating one...'
            // @ts-ignore
            ctx.creatingDefault = true
          }
        },
      },
      {
        title: 'Writing configuration file...',
        skip: (ctx: boolean) => {
          // @ts-ignore
          return ctx.skip
        },
        task: async (ctx, task): Promise<void> => {
          await delay(500)

          let traitsPath = path.resolve('./traits')

          if (fs.existsSync(traitsPath)) {
            task.title = 'Traits folder exists...writing configuration.'

            let traits = fs.readdirSync(traitsPath)
            let stub = require('../../config.stub')

            stub.traits = traits
              .filter(t => t !== '.DS_Store')
              .map(trait => {
                let itemsPath = path.resolve(`./traits/${trait}`)
                let items = fs.readdirSync(itemsPath)

                return {
                  name: trait,
                  items: items.map(item => {
                    return { name: item, weight: 10 }
                  }),
                }
              })
          }

          let stub = require('../../config.stub')

          // @ts-ignore
          if (ctx.creatingDefault) {
            task.title =
              "Traits folder doesn't exist. Generated a default configuration file."

            stub.uniques = [
              {
                Background: 'Black',
                Foreground: 'White',
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
