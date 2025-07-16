#!/usr/bin/env node
import { program } from 'commander'
import packageInfo from '../package.json' with { type: 'json' }
import createHttpServer from '../src/server.js'
import createSocket from '../src/socket.js'

const LIGHTROOM_WS_URL = process.env.LIGHTROOM_WS_URL || 'ws://127.0.0.1:7682'
const PORT = process.env.PORT || 3000

const help = `
Examples:
  $ lightroom-controller
  $ lightroom-controller --version
  $ lightroom-controller --help`

program
  .name('lightroom-controller')
  .description(packageInfo.description)
  .version(packageInfo.version)
  .addHelpText('after', help)
  .action(async () => {
    // Create socket connection to Lightroom
    const socket = await createSocket(LIGHTROOM_WS_URL)
    console.log(`Successfully paired with Lightroom at '${LIGHTROOM_WS_URL}'`)

    // Create and start HTTP server
    await createHttpServer(PORT)(socket)
    console.log(`Server is running at 'http://localhost:${PORT}'`)
  })

program.parse()
