#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs(hideBin(process.argv))
  .commandDir('commands')
  .command(
    '$0',
    'NFT Maker CLI usage',
    () => undefined,
    () => yargs.showHelp()
  )
  .strict()
  .alias({ h: 'help' })
  .epilogue('For more information, check https://twitter.com/davidhemphill')
  .argv
