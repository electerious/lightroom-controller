#!/usr/bin/env node
import { Command } from 'commander'
import packageInfo from '../package.json' with { type: 'json' }
import { init } from './init.js'
import { run } from './run.js'

const help = `
Examples:
  $ lightroom-controller
  $ lightroom-controller init
  $ lightroom-controller --config /path/to/.env
  $ lightroom-controller --version
  $ lightroom-controller --help`

const program = new Command()

program
  .name('lightroom-controller')
  .description(packageInfo.description)
  .version(packageInfo.version)
  .addHelpText('after', help)
  .option('--config <path>', 'path to .env config file')
  .action(run)

program
  .command('init')
  .description('creates a .env file in the current working directory used to run the script')
  .action(async () => {
    const programOptions = program.opts()

    await init(programOptions.config)
  })

program.parse()
