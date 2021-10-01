import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

export function log(msg: string) {
  return console.log(msg)
}

export function error(msg: string) {
  return console.error(chalk.red(msg))
}

export function info(msg: string): any {
  return console.log(msg)
}

export function fail(msg: string) {
  info(chalk.red(msg))
  process.exit(1)
}

export function resolveConfiguration() {
  let configLocation = path.resolve('./project.config.js')

  return fs.existsSync(configLocation)
    ? require(configLocation)
    : fail('Could not find the project configuration.')
}

export function resolveManifest() {
  let manifestLocation = path.resolve('./manifest.json')

  return fs.existsSync(manifestLocation)
    ? require(manifestLocation)
    : fail('Could not find the project manifest.')
}

export function mapWithKeys(myObject: any, iterator: Function) {
  return Object.keys(myObject).map((key, index) => {
    return iterator(key, index)
  })
}
