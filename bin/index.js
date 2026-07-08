#!/usr/bin/env node
import { Command } from 'commander'
import path from 'node:path'
import process from 'node:process'
import packageInfo from '../package.json' with { type: 'json' }
import createHttpServer from '../src/server.js'
import createSocket from '../src/socket.js'
import { init } from './init.js'

try {
  process.loadEnvFile(path.resolve(process.cwd(), '.env'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const LIGHTROOM_WS_URL = process.env.LIGHTROOM_WS_URL || 'ws://127.0.0.1:7682'
const PORT = process.env.PORT || 3000

const help = `
Examples:
  $ lightroom-controller
  $ lightroom-controller init
  $ lightroom-controller --version
  $ lightroom-controller --help`

const program = new Command()

program
  .name('lightroom-controller')
  .description(packageInfo.description)
  .version(packageInfo.version)
  .addHelpText('after', help)
  .action(async () => {
    const socket = await createSocket(LIGHTROOM_WS_URL)
    console.log(`Successfully paired with Lightroom at '${LIGHTROOM_WS_URL}'`)

    await createHttpServer(PORT)(socket)
    console.log(`Server is running at 'http://localhost:${PORT}'`)
  })

program
  .command('init')
  .description('creates a .env file in the current working directory used to run the script')
  .action(init)

program.parse()
